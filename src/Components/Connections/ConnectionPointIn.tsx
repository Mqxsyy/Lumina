import Roact, { useEffect, useRef, useState } from "@rbxts/roact";
import {
	ConnectionData,
	GetAllConnections,
	GetConnectionById,
	GetMovingConnectionId,
	UnbindMovingConnection,
	UpdateConnectionData,
} from "Services/ConnectionsService";
import { GetAllNodes, GetNodeById, NodeConnectionIn, UpdateNodeData } from "Services/NodesService";
import ConnectionPoint from "./ConnectionPoint";

// TODO: make number field that incorporates the connection

interface Props {
	AnchorPoint?: Vector2;
	Position?: UDim2;
	Size?: UDim2;
	NodeId: number;
	NodeFieldName: string;
	BindFunction: (newValue: () => number, boundNodeId: number) => void;
	UnbindFunction: () => void;
}

export default function ConnectionPointIn({
	NodeId,
	NodeFieldName,
	AnchorPoint = new Vector2(0, 0),
	Position = UDim2.fromScale(0, 0),
	Size = UDim2.fromScale(1, 1),
	BindFunction,
	UnbindFunction,
}: Props) {
	const [connectionId, setConnectionId] = useState(-1);
	const nodeDataRef = useRef(GetNodeById(NodeId)!.data);
	const elementRef = useRef<TextButton>();

	const finishConnection = (id: number) => {
		if (elementRef.current === undefined) return;
		if (nodeDataRef.current.element === undefined) return;

		const offset = elementRef.current.AbsolutePosition.sub(nodeDataRef.current.element!.AbsolutePosition).add(
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

		const onDestroy = connectionData.onDestroy.Connect(() => {
			onDestroy.Disconnect();

			setConnectionId(-1);
			UnbindFunction();

			UpdateNodeData(NodeId, (data) => {
				const index = data.connectionsIn.findIndex((connection) => connection.id === connectionData.id);
				if (index !== -1) {
					data.connectionsIn.remove(index);
				}

				return data;
			});
		});

		BindFunction(connectionData.fn, connectionData.startNode.node.id);
	};

	const mouseButton1Up = () => {
		const movingConnectionId = GetMovingConnectionId();
		if (movingConnectionId === -1) return;

		UnbindMovingConnection();
		finishConnection(movingConnectionId);
	};

	useEffect(() => {
		if (elementRef.current === undefined) return;
		if (nodeDataRef.current.element === undefined) return;

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
	}, [elementRef.current, nodeDataRef.current.element]);

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
