import Roact, { useRef, useState } from "@rbxts/roact";
import {
	ConnectionData,
	GetConnectionById,
	GetMovingConnectionId,
	UnbindMovingConnection,
	UpdateConnectionData,
} from "Services/ConnectionsService";
import { GetNodeById, NodeConnectionIn, UpdateNodeData } from "Services/NodesService";
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

	const mouseButton1Up = (element: TextButton) => {
		const movingConnectionId = GetMovingConnectionId();
		if (movingConnectionId === -1) return;

		const offset = element.AbsolutePosition.sub(nodeDataRef.current.element!.AbsolutePosition).add(
			element.AbsoluteSize.mul(0.5),
		);

		setConnectionId(movingConnectionId);

		UpdateConnectionData(movingConnectionId, (data: ConnectionData) => {
			data.endNode = GetNodeById(NodeId)!.data;
			data.endOffset = offset;
			return data;
		});

		UnbindMovingConnection();

		const connectionData = GetConnectionById(movingConnectionId)!.data;

		UpdateNodeData(NodeId, (data) => {
			const connection: NodeConnectionIn = {
				id: movingConnectionId,
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

		BindFunction(connectionData.fn, connectionData.id);
	};

	return (
		<ConnectionPoint
			AnchorPoint={AnchorPoint}
			Position={Position}
			Size={Size}
			ConnectionId={connectionId === -1 ? undefined : connectionId}
			MouseButton1Up={mouseButton1Up}
		/>
	);
}
