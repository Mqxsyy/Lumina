import Roact, { useRef, useState } from "@rbxts/roact";
import {
	GetConnectionById,
	GetMovingConnection,
	UnbindConnectionMoving,
	UpdateConnectionEnd,
} from "Services/ConnectionsService";
import ConnectionPoint from "./ConnectionPoint";

interface Props {
	AnchorPoint?: Vector2;
	Position?: UDim2;
	Size?: UDim2;
	BindFunction: (newValue: undefined | (() => number)) => void;
}

export default function ConnectionPointIn({
	AnchorPoint = new Vector2(0, 0),
	Position = UDim2.fromScale(0, 0),
	Size = UDim2.fromScale(1, 1),
	BindFunction,
}: Props) {
	const [connectionId, setConnectionId] = useState(-1);
	const destroyRef = useRef(undefined as undefined | RBXScriptConnection);

	const MouseButton1Up = (element: TextButton) => {
		const movingConnection = GetMovingConnection();
		if (movingConnection.id === -1) return;

		const pos = element.AbsolutePosition;
		const size = element.AbsoluteSize;

		setConnectionId(movingConnection.id);
		UpdateConnectionEnd(movingConnection.id, pos.add(size.mul(0.5)));
		UnbindConnectionMoving();

		const connection = GetConnectionById(movingConnection.id);
		destroyRef.current = connection!.data.onDestroy.Connect(() => {
			setConnectionId(-1);
			BindFunction(undefined);
			destroyRef.current!.Disconnect();
		});

		BindFunction(movingConnection.fn!);
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
