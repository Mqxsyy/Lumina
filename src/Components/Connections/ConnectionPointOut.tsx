import React, { useEffect, useRef, useState } from "@rbxts/react";
import type { ParticleData } from "API/ParticleService";
import { type ConnectionData, CreateConnection, GetMovingConnectionId, StartMovingConnection } from "Services/ConnectionsService";
import { GetNodeById, type NodeCollectionEntry, type NodeConnectionOut, UpdateNodeData } from "Services/NodesService";
import { GetZoomScale } from "ZoomScale";
import ConnectionPoint from "./ConnectionPoint";

interface Props {
    AnchorPoint?: Vector2;
    Position?: UDim2;
    Size?: UDim2;

    NodeId: number;
    ValueType: string;
    ValueName: string;
    Fn: (particleData: ParticleData) => number | Vector2 | Vector3 | Color3;
}

export default function ConnectionPointOut({
    AnchorPoint = new Vector2(0, 0),
    Position = UDim2.fromScale(0, 0),
    Size = UDim2.fromOffset(20 * GetZoomScale(), 20 * GetZoomScale()),
    NodeId,
    ValueType,
    ValueName,
    Fn,
}: Props) {
    const [connectionIds, setConnectionIds] = useState<number[]>([]);
    const elementRef = useRef<ImageButton>();

    const node = GetNodeById(NodeId) as NodeCollectionEntry;
    const nodeData = node.data;

    const createConnection = (loadedId?: number) => {
        if (elementRef.current === undefined) return;
        if (node.element === undefined) return;

        const connectionData = CreateConnection(nodeData, elementRef.current, ValueType, Fn, loadedId);
        setConnectionIds((prev) => [...prev, connectionData.id]);

        UpdateNodeData(NodeId, (data) => {
            const connection: NodeConnectionOut = {
                id: connectionData.id,
                valueName: ValueName,
            };

            data.connectionsOut.push(connection);
            return data;
        });

        const onDestroy = connectionData.onDestroy.Connect(() => {
            onDestroy.Disconnect();
            setConnectionIds((prev) => prev.filter((id) => id !== connectionData.id));

            if (GetNodeById(NodeId) === undefined) return;

            UpdateNodeData(NodeId, (data) => {
                const index = data.connectionsOut.findIndex((connection) => connection.id === connectionData.id);
                if (index !== -1) {
                    data.connectionsOut.remove(index);
                }

                return data;
            });
        });

        return connectionData;
    };

    const mouseButton1Down = () => {
        if (GetMovingConnectionId() !== -1) return;

        const connectionData = createConnection() as ConnectionData;
        StartMovingConnection(connectionData.id);
    };

    useEffect(() => {
        if (elementRef.current === undefined) return;
        if (node.element === undefined) return;

        if (nodeData.loadedConnectionsOut === undefined) return;
        if (nodeData.loadedConnectionsOut.size() === 0) return;

        for (const connection of nodeData.loadedConnectionsOut) {
            if (connection.valueName === ValueName) {
                createConnection(connection.id);

                UpdateNodeData(NodeId, (data) => {
                    if (data.loadedConnectionsOut !== undefined) {
                        data.loadedConnectionsOut = data.loadedConnectionsOut.filter(
                            (loadedConnection) => loadedConnection.id !== connection.id,
                        );
                    }

                    return data;
                });
            }
        }
    }, [elementRef.current, node.element, nodeData.loadedConnectionsOut]);

    return (
        <ConnectionPoint
            AnchorPoint={AnchorPoint}
            Position={Position}
            Size={Size}
            ValueType={ValueType}
            ConnectionIds={connectionIds.size() === 0 ? undefined : connectionIds}
            GetElementRef={(element) => {
                elementRef.current = element;
            }}
            MouseButton1Down={mouseButton1Down}
        />
    );
}
