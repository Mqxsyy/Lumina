import React, { useEffect, useRef, useState } from "@rbxts/react";
import { LogicNode } from "API/Nodes/Logic/LogicNode";
import {
    ConnectionData,
    DestroyConnection,
    GetAllConnections,
    GetConnectionById,
    GetMovingConnectionId,
    UnbindMovingConnection,
    UpdateConnectionData,
} from "Services/ConnectionsService";
import { GetNodeById, NodeConnectionIn, UpdateNodeData } from "Services/NodesService";
import { GetZoomScale } from "ZoomScale";
import ConnectionPoint from "./ConnectionPoint";
import { FastEventConnection } from "API/Bindables/FastEvent";

interface Props {
    AnchorPoint?: Vector2;
    Position?: UDim2;
    Size?: UDim2;
    NodeId: number;
    NodeFieldName: string;
    ValueName?: string;
    BindFunction: (newValue: () => number, boundNode: LogicNode) => void;
    UnbindFunction: () => void;
}

export default function ConnectionPointIn({
    NodeId,
    NodeFieldName,
    ValueName = undefined,
    AnchorPoint = new Vector2(0, 0),
    Position = UDim2.fromScale(0, 0),
    Size = UDim2.fromOffset(10 * GetZoomScale(), 10 * GetZoomScale()),
    BindFunction,
    UnbindFunction,
}: Props) {
    const [_, setForceRender] = useState(0);
    const [connectionId, setConnectionId] = useState(-1);
    const elementRef = useRef<ImageButton>();
    const isLoadingConnectionsRef = useRef(false);

    const node = GetNodeById(NodeId)!;
    const nodeData = node.data;

    const finishConnection = (id: number) => {
        if (elementRef.current === undefined) return;
        if (node.element === undefined) return;

        setConnectionId(id);

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

        const connectionData = GetConnectionById(id)!.data;

        const destroyConnection = connectionData.onDestroy.Connect(() => {
            destroyConnection.Disconnect();

            setConnectionId(-1);
            UnbindFunction();

            if (GetNodeById(NodeId) === undefined) return;

            UpdateNodeData(NodeId, (data) => {
                const index = data.connectionsIn.findIndex((connection) => connection.id === connectionData.id);
                if (index !== -1) {
                    data.connectionsIn.remove(index);
                }

                return data;
            });
        });

        BindFunction(connectionData.fn, connectionData.startNode.node as LogicNode);
    };

    const mouseButton1Down = () => {
        if (connectionId === -1) return;
        DestroyConnection(connectionId);
    };

    const mouseButton1Up = () => {
        if (connectionId !== -1) return;

        const movingConnectionId = GetMovingConnectionId();
        if (movingConnectionId === -1) return;

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
        const connection = node.elementLoaded.Connect(() => {
            setForceRender((prev) => ++prev);
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
                            if (
                                loadedConnection.fieldName === NodeFieldName &&
                                loadedConnection.valueName === ValueName
                            ) {
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
                warn("Failed to load connection for node: " + nodeData.node.GetNodeName());
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
            ConnectionId={connectionId === -1 ? undefined : connectionId}
            GetElementRef={(element) => {
                elementRef.current = element;
            }}
            MouseButton1Down={mouseButton1Down}
            MouseButton1Up={mouseButton1Up}
        />
    );
}
