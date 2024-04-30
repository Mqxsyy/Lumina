import Roact, { useEffect, useRef, useState } from "@rbxts/roact";
import {
	CreateConnection,
	DestroyConnection,
	StartMovingConnection,
	UnbindMovingConnection,
} from "Services/ConnectionsService";
import { GetNodeById, NodeConnectionOut, UpdateNodeData } from "Services/NodesService";
import ConnectionPoint from "./ConnectionPoint";
import { GetZoomScale } from "ZoomScale";

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
	Size = UDim2.fromOffset(14 * GetZoomScale(), 14 * GetZoomScale()),
	BindFunction,
}: Props) {
	const [connectionId, setConnectionId] = useState(-1);
	const nodeRef = useRef(GetNodeById(NodeId)!);
	const elementRef = useRef<TextButton>();

	const createConnection = (loadedId?: number) => {
		if (elementRef.current === undefined) return;
		if (nodeRef.current.element === undefined) return;

		const offset = elementRef.current.AbsolutePosition.sub(nodeRef.current.element!.AbsolutePosition).add(
			elementRef.current.AbsoluteSize.mul(0.5),
		);

		const node = GetNodeById(NodeId)!.data;
		const connectionData = CreateConnection(node, offset, BindFunction, loadedId);

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
		const destroyConnection = nodeRef.current.data.onDestroy.Connect(() => {
			destroyConnection.Disconnect();
			if (connectionId !== -1) {
				UnbindMovingConnection();
				DestroyConnection(connectionId);
			}
		});

		return () => {
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
