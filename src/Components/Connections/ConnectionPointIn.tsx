import Roact, { useRef, useState } from "@rbxts/roact";
import {
	GetConnectionById,
	GetMovingConnectionId,
	UnbindConnectionMoving,
	UpdateConnectionEnd,
} from "Services/ConnectionsService";
import ConnectionPoint from "./ConnectionPoint";

interface Props {
	AnchorPoint?: Vector2;
	Position?: UDim2;
	Size?: UDim2;
}

export default function ConnectionPointIn({
	AnchorPoint = new Vector2(0, 0),
	Position = UDim2.fromScale(0, 0),
	Size = UDim2.fromScale(1, 1),
}: Props) {
	const [connectionId, setConnectionId] = useState(-1);
	const destroyRef = useRef(undefined as undefined | RBXScriptConnection);

	const MouseButton1Up = (element: TextButton) => {
		const movingConnectionId = GetMovingConnectionId();
		if (movingConnectionId === -1) return;

		const pos = element.AbsolutePosition;
		const size = element.AbsoluteSize;

		setConnectionId(movingConnectionId);
		UpdateConnectionEnd(movingConnectionId, pos.add(size.mul(0.5)));
		UnbindConnectionMoving();

		const connection = GetConnectionById(movingConnectionId);
		destroyRef.current = connection!.data.onDestroy.Connect(() => {
			setConnectionId(-1);
			destroyRef.current!.Disconnect();
		});
	};

	const UpdateConnection = (element: TextButton) => {
		if (connectionId === -1) return;

		const pos = element.AbsolutePosition;
		const size = element.AbsoluteSize;

		UpdateConnectionEnd(connectionId, pos.add(size.mul(0.5)));
	};

	return (
		<ConnectionPoint
			AnchorPoint={AnchorPoint}
			Position={Position}
			Size={Size}
			ConnectionId={connectionId === -1 ? undefined : connectionId}
			MouseButton1Up={MouseButton1Up}
			UpdateConnecton={UpdateConnection}
		/>
	);
}
