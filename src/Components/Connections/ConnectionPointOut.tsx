import React, { useEffect, useRef, useState } from "@rbxts/react";
import {
    CreateConnection,
    DestroyConnection,
    StartMovingConnection,
    UnbindMovingConnection,
} from "Services/ConnectionsService";
import { GetNodeById, NodeConnectionOut, UpdateNodeData } from "Services/NodesService";
import { GetZoomScale } from "ZoomScale";
import ConnectionPoint from "./ConnectionPoint";
import { FastEventConnection } from "API/Bindables/FastEvent";

interface Props {
    AnchorPoint?: Vector2;
    Position?: UDim2;
    Size?: UDim2;
    NodeId: number;
    BindFunction: () => number;
}

export default function ConnectionPointOut({
    NodeId,
    AnchorPoint = new Vector2(0, 0),
    Position = UDim2.fromScale(0, 0),
    Size = UDim2.fromOffset(10 * GetZoomScale(), 10 * GetZoomScale()),
    BindFunction,
}: Props) {
    const [_, setForceRender] = useState(0);
    const [connectionId, setConnectionId] = useState(-1);
    const elementRef = useRef<ImageButton>();

    const node = GetNodeById(NodeId)!;
    const nodeData = node.data;

    const createConnection = (loadedId?: number) => {
        if (elementRef.current === undefined) return;
        if (node.element === undefined) return;

        const connectionData = CreateConnection(nodeData, elementRef.current, BindFunction, loadedId);
        setConnectionId(connectionData.id);

        UpdateNodeData(NodeId, (data) => {
            const connection: NodeConnectionOut = {
                id: connectionData.id,
            };

            data.connectionsOut.push(connection);
            return data;
        });

        const onDestroy = connectionData.onDestroy.Connect(() => {
            onDestroy.Disconnect();
            setConnectionId(-1);

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
        if (connectionId === -1) {
            const connectionData = createConnection()!;
            StartMovingConnection(connectionData.id);
            return;
        }

        UnbindMovingConnection();
        DestroyConnection(connectionId);
    };

    useEffect(() => {
        const connection = node.elementLoaded.Connect(() => {
            setForceRender((prev) => (prev > 10 ? 0 : ++prev));
        });

        return () => {
            connection.Disconnect();
        };
    }, []);

    useEffect(() => {
        let destroyConnection: FastEventConnection | undefined = nodeData.onDestroy.Connect(() => {
            if (destroyConnection === undefined) return;

            destroyConnection.Disconnect();
            destroyConnection = undefined;
            if (connectionId !== -1) {
                UnbindMovingConnection();
                DestroyConnection(connectionId);
            }
        });

        return () => {
            if (destroyConnection === undefined) return;
            destroyConnection.Disconnect();
        };
    }, [nodeData.onDestroy, connectionId]);

    useEffect(() => {
        if (elementRef.current === undefined) return;
        if (node.element === undefined) return;

        if (nodeData.loadedConnectionsOut === undefined) return;
        if (nodeData.loadedConnectionsOut.size() === 0) return;

        nodeData.loadedConnectionsOut.forEach((connection) => {
            createConnection(connection.id);
        });

        UpdateNodeData(NodeId, (data) => {
            data.loadedConnectionsOut = undefined;
            return data;
        });
    }, [elementRef.current, node.element, nodeData.loadedConnectionsOut]);

    return (
        <ConnectionPoint
            AnchorPoint={AnchorPoint}
            Position={Position}
            Size={Size}
            ConnectionId={connectionId === -1 ? undefined : connectionId}
            GetElementRef={(element) => {
                elementRef.current = element;
            }}
            MouseButton1Down={mouseButton1Down}
        />
    );
}
