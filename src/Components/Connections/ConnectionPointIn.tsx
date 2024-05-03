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

interface Props {
    AnchorPoint?: Vector2;
    Position?: UDim2;
    Size?: UDim2;
    NodeId: number;
    NodeFieldName: string;
    BindFunction: (newValue: () => number, boundNode: LogicNode) => void;
    UnbindFunction: () => void;
}

export default function ConnectionPointIn({
    NodeId,
    NodeFieldName,
    AnchorPoint = new Vector2(0, 0),
    Position = UDim2.fromScale(0, 0),
    Size = UDim2.fromOffset(10 * GetZoomScale(), 10 * GetZoomScale()),
    BindFunction,
    UnbindFunction,
}: Props) {
    const [connectionId, setConnectionId] = useState(-1);

    const nodeRef = useRef(GetNodeById(NodeId)!);
    const nodeDataRef = useRef(nodeRef.current.data);
    const elementRef = useRef<ImageButton>();

    const finishConnection = (id: number) => {
        if (elementRef.current === undefined) return;
        if (nodeRef.current.element === undefined) return;

        const offset = elementRef.current.AbsolutePosition.sub(nodeRef.current.element!.AbsolutePosition).add(
            elementRef.current.AbsoluteSize.mul(0.5),
        );

        setConnectionId(id);

        UpdateConnectionData(id, (data: ConnectionData) => {
            data.endNode = GetNodeById(NodeId)!.data;
            data.endOffset = offset;
            return data;
        });

        const connectionData = GetConnectionById(id)!.data;

        UpdateNodeData(NodeId, (data) => {
            const connection: NodeConnectionIn = {
                id: id,
                fieldName: NodeFieldName,
            };

            data.connectionsIn.push(connection);
            return data;
        });

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

    const mouseButton1Up = () => {
        const movingConnectionId = GetMovingConnectionId();
        if (movingConnectionId === -1) return;

        UnbindMovingConnection();
        finishConnection(movingConnectionId);
    };

    useEffect(() => {
        const destroyConnection = nodeDataRef.current.onDestroy.Connect(() => {
            destroyConnection.Disconnect();
            if (connectionId !== -1) {
                DestroyConnection(connectionId);
            }
        });

        return () => {
            destroyConnection.Disconnect();
        };
    }, [nodeDataRef.current.onDestroy, connectionId]);

    useEffect(() => {
        if (elementRef.current === undefined) return;
        if (nodeRef.current.element === undefined) return;

        task.spawn(() => {
            if (nodeDataRef.current.loadedConnectionsIn === undefined) return;
            if (nodeDataRef.current.loadedConnectionsIn.size() === 0) return;

            const maxAttempts = 10;
            let attempts = 0;

            while (attempts < maxAttempts) {
                for (let i = nodeDataRef.current.loadedConnectionsIn.size() - 1; i >= 0; i--) {
                    const loadedConnection = nodeDataRef.current.loadedConnectionsIn[i];

                    for (const connection of GetAllConnections()) {
                        if (connection.data.loadedId === loadedConnection.id) {
                            finishConnection(connection.data.id);
                            nodeDataRef.current.loadedConnectionsIn.remove(i);
                            break;
                        }
                    }
                }

                if (nodeDataRef.current.loadedConnectionsIn.size() === 0) break;
                attempts++;
                task.wait(0.1);
            }

            if (attempts >= maxAttempts) {
                warn("Failed to load connection for node: " + nodeDataRef.current.node.GetNodeName());
            }

            nodeDataRef.current.loadedConnectionsIn = undefined;
        });
    }, [elementRef.current, nodeRef.current.element]);

    return (
        <ConnectionPoint
            AnchorPoint={AnchorPoint}
            Position={Position}
            Size={Size}
            ConnectionId={connectionId === -1 ? undefined : connectionId}
            GetElementRef={(element) => {
                elementRef.current = element;
            }}
            MouseButton1Up={mouseButton1Up}
        />
    );
}
