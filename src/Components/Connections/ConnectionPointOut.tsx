import Roact, { useRef, useState } from "@rbxts/roact";
import {
	BindConnectionMoving,
	RemoveConnection,
	UnbindConnectionMoving,
	UpdateConnectionStart,
} from "Services/ConnectionsService";
import { GetMousePositionOnCanvas } from "WidgetHandler";
import { CreateConnection } from "./ConnectionLine";
import ConnectionPoint from "./ConnectionPoint";

interface Props {
	AnchorPoint?: Vector2;
	Position?: UDim2;
	Size?: UDim2;
	Fn: () => number;
}

export default function ConnectionPointOut({
	AnchorPoint = new Vector2(0, 0),
	Position = UDim2.fromScale(0, 0),
	Size = UDim2.fromScale(1, 1),
	Fn,
}: Props) {
	const [connectionId, setConnectionId] = useState(-1);
	const destroyRef = useRef(undefined as undefined | RBXScriptConnection);

	const MouseButton1Down = (element: TextButton) => {
		if (connectionId === -1) {
			const pos = element.AbsolutePosition;
			const size = element.AbsoluteSize;
			const mousePosition = GetMousePositionOnCanvas();

			const connectionData = CreateConnection(pos.add(size.mul(0.5)), mousePosition);
			setConnectionId(connectionData.id);
			BindConnectionMoving(connectionData.id, Fn);

			destroyRef.current = connectionData.onDestroy.Connect(() => {
				setConnectionId(-1);
				destroyRef.current!.Disconnect();
			});

			return;
		}

		UnbindConnectionMoving();
		RemoveConnection(connectionId);
	};

	const UpdateConnection = (element: TextButton) => {
		if (connectionId === -1) return;

		const pos = element.AbsolutePosition;
		const size = element.AbsoluteSize;

		UpdateConnectionStart(connectionId, pos.add(size.mul(0.5)));
	};

	return (
		<ConnectionPoint
			AnchorPoint={AnchorPoint}
			Position={Position}
			Size={Size}
			ConnectionId={connectionId === -1 ? undefined : connectionId}
			MouseButton1Down={MouseButton1Down}
			UpdateConnecton={UpdateConnection}
		/>
	);
}
