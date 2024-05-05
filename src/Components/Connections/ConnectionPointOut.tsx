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
    const [connectionId, setConnectionId] = useState(-1);
    const nodeRef = useRef(GetNodeById(NodeId)!);
    const elementRef = useRef<ImageButton>();

    const createConnection = (loadedId?: number) => {
        if (elementRef.current === undefined) return;
        if (nodeRef.current.element === undefined) return;

        const node = GetNodeById(NodeId)!.data;
        const connectionData = CreateConnection(node, elementRef.current, BindFunction, loadedId);

        setConnectionId(connectionData.id);

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

            UpdateNodeData(NodeId, (data) => {
                const connection: NodeConnectionOut = {
                    id: connectionData.id,
                };

                data.connectionsOut.push(connection);
                return data;
            });

            StartMovingConnection(connectionData.id);
            return;
        }

        UnbindMovingConnection();
        DestroyConnection(connectionId);
    };

    useEffect(() => {
        let destroyConnection: FastEventConnection | undefined = nodeRef.current.data.onDestroy.Connect(() => {
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
    }, [nodeRef.current.data.onDestroy, connectionId]);

    useEffect(() => {
        if (elementRef.current === undefined) return;
        if (nodeRef.current.element === undefined) return;

        if (nodeRef.current.data.loadedConnectionsOut === undefined) return;
        if (nodeRef.current.data.loadedConnectionsOut.size() === 0) return;

        nodeRef.current.data.loadedConnectionsOut.forEach((connection) => {
            createConnection(connection.id);
        });

        nodeRef.current.data.loadedConnectionsOut = undefined;
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
            MouseButton1Down={mouseButton1Down}
        />
    );
}
