import Roact, { useState } from "@rbxts/roact";
import {
	CreateConnection,
	DestroyConnection,
	StartMovingConnection,
	UnbindMovingConnection,
} from "Services/ConnectionsService";
import { GetNodeById, NodeConnectionOut, UpdateNodeData } from "Services/NodesService";
import ConnectionPoint from "./ConnectionPoint";

interface Props {
	AnchorPoint?: Vector2;
	Position?: UDim2;
	Size?: UDim2;
	NodeId: number;
	NodeAbsolutePosition?: Vector2;
	BindFunction: () => number;
}

export default function ConnectionPointOut({
	NodeId,
	AnchorPoint = new Vector2(0, 0),
	Position = UDim2.fromScale(0, 0),
	Size = UDim2.fromScale(1, 1),
	NodeAbsolutePosition,
	BindFunction,
}: Props) {
	const [connectionId, setConnectionId] = useState(-1);

	const MouseButton1Down = (element: TextButton) => {
		if (connectionId === -1) {
			if (NodeAbsolutePosition === undefined) return;

			const offset = element.AbsolutePosition.sub(NodeAbsolutePosition).add(element.AbsoluteSize.mul(0.5));

			const node = GetNodeById(NodeId)!.data;
			const connectionData = CreateConnection(node, offset, BindFunction);

			setConnectionId(connectionData.id);

			UpdateNodeData(NodeId, (data) => {
				const connection: NodeConnectionOut = {
					id: 0,
				};

				data.connectionsOut.push(connection);
				return data;
			});

			StartMovingConnection(connectionData.id);

			const onDestroy = connectionData.onDestroy.Connect(() => {
				onDestroy.Disconnect();
				setConnectionId(-1);

				UpdateNodeData(NodeId, (data) => {
					const index = data.connectionsOut.findIndex((connection) => connection.id === connectionData.id);
					if (index !== -1) {
						data.connectionsOut.remove(index);
					}

					return data;
				});
			});

			return;
		}

		UnbindMovingConnection();
		DestroyConnection(connectionId);
	};

	return (
		<ConnectionPoint
			AnchorPoint={AnchorPoint}
			Position={Position}
			Size={Size}
			ConnectionId={connectionId === -1 ? undefined : connectionId}
			MouseButton1Down={MouseButton1Down}
		/>
	);
}
