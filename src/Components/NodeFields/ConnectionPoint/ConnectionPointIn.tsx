import Roact, { useRef, useState } from "@rbxts/roact";
import { CONNECTION_POINT_BORDER_SIZE, CONNECTION_POINT_SIZE } from "./ConnectionPointConfig";
import { StyleColors } from "Style";
import { SetTargetField } from "FieldsHandler";

interface ConnectionPointInProps extends NodeFieldProps {
	field: GuiObject;
}

export function ConnectionPointIn({ ZIndex, field }: ConnectionPointInProps) {
	const [isConnected, setIsConnected] = useState(false);

	const connectionPointRef = useRef(undefined as Frame | undefined);

	return (
		<>
			<frame
				AnchorPoint={new Vector2(0, 0.5)}
				Position={new UDim2(0, 5, 0.5, 0)}
				Size={UDim2.fromOffset(CONNECTION_POINT_SIZE.X, CONNECTION_POINT_SIZE.Y)}
				ref={connectionPointRef}
				ZIndex={ZIndex + 1}
				Event={{
					InputEnded: (_, inputObject) => {
						if (inputObject.UserInputType === Enum.UserInputType.MouseButton1) {
							setIsConnected(true);
							print("SET CONNECTION");

							const targetPos = connectionPointRef
								.current!.AbsolutePosition.sub(field.AbsolutePosition)
								.add(
									new Vector2(
										CONNECTION_POINT_SIZE.X + CONNECTION_POINT_BORDER_SIZE,
										CONNECTION_POINT_SIZE.Y + CONNECTION_POINT_BORDER_SIZE,
									).mul(0.5),
								);

							SetTargetField(targetPos);
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
