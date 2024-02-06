import Roact, { useEffect, useRef, useState } from "@rbxts/roact";
import { CONNECTION_POINT_BORDER_SIZE, CONNECTION_POINT_SIZE } from "./ConnectionPointConfig";
import { StyleColors } from "Style";
import { SetTargetField } from "FieldsHandler";

interface ConnectionPointInProps extends NodeFieldProps {
	field: GuiObject;
}

export interface FieldQueryData {
	connectionPointPosition: Vector2;
	connectionPointSize: Vector2;
}

export function ConnectionPointIn({ ZIndex, field }: ConnectionPointInProps) {
	const [isConnected, setIsConnected] = useState(false);
	const [updateConnectedField, setUpdateConnectedField] = useState<undefined | (() => void)>(undefined);
	const connectionPointRef = useRef(undefined as Frame | undefined);

	const OnDisconnect = () => {
		print("DISCONNECT IN");

		setIsConnected(false);
		setUpdateConnectedField(undefined);
	};

	const GetData = () => {
		return {
			connectionPointPosition: connectionPointRef.current!.AbsolutePosition,
			connectionPointSize: connectionPointRef.current?.AbsoluteSize,
		} as FieldQueryData;
	};

	useEffect(() => {
		if (updateConnectedField === undefined) return;
		updateConnectedField();
	}, [connectionPointRef.current?.AbsolutePosition]);

	return (
		<>
			<frame
				AnchorPoint={new Vector2(0, 0)}
				Position={UDim2.fromScale(0, 0)}
				Size={UDim2.fromScale(1, 1)}
				SizeConstraint={"RelativeYY"}
				BackgroundTransparency={1}
				ref={connectionPointRef}
				ZIndex={ZIndex + 1}
				Event={{
					InputEnded: (_, inputObject) => {
						if (inputObject.UserInputType === Enum.UserInputType.MouseButton1) {
							setIsConnected(true);
							const updateField = SetTargetField(GetData, OnDisconnect);
							if (updateField) {
								setUpdateConnectedField(() => updateField);
							}
						}
					},
				}}
			>
				<uicorner CornerRadius={new UDim(1, 0)} />

				<frame
					AnchorPoint={new Vector2(0.5, 0.5)}
					Position={UDim2.fromScale(0.5, 0.5)}
					Size={UDim2.fromOffset(CONNECTION_POINT_SIZE.X, CONNECTION_POINT_SIZE.Y)}
					BackgroundColor3={StyleColors.hex200}
					BackgroundTransparency={isConnected ? 0 : 1}
					ZIndex={ZIndex + 2}
				>
					<uicorner CornerRadius={new UDim(1, 0)} />
					<uistroke Color={StyleColors.hex200} Thickness={CONNECTION_POINT_BORDER_SIZE} />
				</frame>
			</frame>
		</>
	);
}
