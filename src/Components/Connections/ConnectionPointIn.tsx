import React, { useEffect, useRef, useState } from "@rbxts/react";
import type { FastEvent, FastEventConnection } from "API/Bindables/FastEvent";
import type { LogicNode } from "API/Nodes/Logic/LogicNode";
import type { ParticleData } from "API/ParticleService";
import { ReloadConnectionVisuals } from "Components/Events";
import {
    type ConnectionCollectionEntry,
    type ConnectionData,
    DestroyConnection,
    GetAllConnections,
    GetConnectionById,
    GetMovingConnectionId,
    UnbindMovingConnection,
    UpdateConnectionData,
} from "Services/ConnectionsService";
import { GetNodeById, type NodeCollectionEntry, type NodeConnectionIn, UpdateNodeData } from "Services/NodesService";
import { GetZoomScale } from "ZoomScale";
import ConnectionPoint from "./ConnectionPoint";

interface Props {
    AnchorPoint?: Vector2;
    Position?: UDim2;
    Size?: UDim2;

    NodeId: number;
    NodeFieldName: string;
    ValueName: string;
    ValueType: string;

    BindNode: (boundNode: LogicNode, fn: (data: ParticleData) => number | Vector2 | Vector3 | Color3) => void;
    UnbindNode: () => void;
}

export default function ConnectionPointIn({
    NodeId,
    NodeFieldName,
    ValueName,
    AnchorPoint = new Vector2(0, 0),
    Position = UDim2.fromScale(0, 0),
    Size = UDim2.fromOffset(20 * GetZoomScale(), 20 * GetZoomScale()),
    ValueType,
    BindNode,
    UnbindNode,
}: Props) {
    const [connectionId, setConnectionId] = useState(-1);
    const connectionIdRef = useRef(-1);

    const elementRef = useRef<ImageButton>();
    const isLoadingConnectionsRef = useRef(false);

    const node = GetNodeById(NodeId) as NodeCollectionEntry;
    const nodeData = node.data;

    const updateConnectionId = (id: number) => {
        connectionIdRef.current = id;
        setConnectionId(id);
    };

    const finishConnection = (id: number) => {
        if (elementRef.current === undefined) return;
        if (node.element === undefined) return;

        updateConnectionId(id);

        UpdateConnectionData(id, (data: ConnectionData) => {
            data.endElement = elementRef.current;
            return data;
        });

        UpdateNodeData(NodeId, (data) => {
            const connection: NodeConnectionIn = {
                id: id,
                fieldName: NodeFieldName,
                valueName: ValueName,
            };

            data.connectionsIn.push(connection);
            return data;
        });

        const connectionData = (GetConnectionById(id) as ConnectionCollectionEntry).data;

        const destroyConnection = connectionData.onDestroy.Connect(() => {
            destroyConnection.Disconnect();

            updateConnectionId(-1);
            UnbindNode();

            if (GetNodeById(NodeId) === undefined) return;

            UpdateNodeData(NodeId, (data) => {
                const index = data.connectionsIn.findIndex((connection) => connection.id === connectionData.id);
                if (index !== -1) {
                    data.connectionsIn.remove(index);
                }

                return data;
            });
        });

        BindNode(connectionData.startNode.node as LogicNode, connectionData.fn);

        coroutine.wrap(() => {
            task.wait();
            ReloadConnectionVisuals.Fire();
        })();
    };

    const mouseButton1Down = () => {
        if (connectionId === -1) return;
        DestroyConnection(connectionId);

        task.wait();
        ReloadConnectionVisuals.Fire();
    };

    const mouseButton1Up = () => {
        if (connectionId !== -1) return;

        const movingConnectionId = GetMovingConnectionId();
        if (movingConnectionId === -1) return;

        const connectionData = (GetConnectionById(movingConnectionId) as ConnectionCollectionEntry).data;
        if (connectionData.startNode.node.id === NodeId) return;

        if (connectionData.valueType !== ValueType) return;

        UnbindMovingConnection();
        finishConnection(movingConnectionId);
    };

    useEffect(() => {
        if (nodeData.connectionsIn.size() === 0) return;
        if (connectionId !== -1) return;

        for (const connection of nodeData.connectionsIn) {
            if (connection.fieldName !== NodeFieldName) continue;
            if (connection.valueName !== ValueName) continue;

            finishConnection(connection.id);
            break;
        }
    });

    useEffect(() => {
        if (elementRef.current === undefined) return;
        if (node.element === undefined) return;
        if (nodeData.loadedConnectionsIn === undefined) return;
        if (nodeData.loadedConnectionsIn.size() === 0) return;
        if (isLoadingConnectionsRef.current) return;

        isLoadingConnectionsRef.current = true;
        task.spawn(() => {
            const maxAttempts = 10;
            let attempts = 0;

            while (attempts < maxAttempts) {
                if (nodeData.loadedConnectionsIn === undefined) return;

                for (let i = nodeData.loadedConnectionsIn.size() - 1; i >= 0; i--) {
                    const loadedConnection = nodeData.loadedConnectionsIn[i];

                    for (const connection of GetAllConnections()) {
                        if (connection.data.loadedId === loadedConnection.id) {
                            if (loadedConnection.fieldName === NodeFieldName && loadedConnection.valueName === ValueName) {
                                finishConnection(connection.data.id);
                                nodeData.loadedConnectionsIn.remove(i);
                                break;
                            }
                        }
                    }
                }

                if (nodeData.loadedConnectionsIn.size() === 0) break;
                attempts++;
                task.wait(0.25);
            }

            if (attempts >= maxAttempts) {
                warn(`Failed to load connection for node: ${nodeData.node.GetClassName()}`);
            }

            nodeData.loadedConnectionsIn = undefined;
            isLoadingConnectionsRef.current = false;
        });
    }, [elementRef.current, node.element, nodeData.loadedConnectionsIn]);

    return (
        <ConnectionPoint
            AnchorPoint={AnchorPoint}
            Position={Position}
            Size={Size}
            ConnectionIds={connectionId === -1 ? undefined : [connectionId]}
            ValueType={ValueType}
            GetElementRef={(element) => {
                elementRef.current = element;
            }}
            MouseButton1Down={mouseButton1Down}
            MouseButton1Up={mouseButton1Up}
        />
    );
}
