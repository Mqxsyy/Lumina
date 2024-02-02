import Roact, { useEffect, useRef, useState } from "@rbxts/roact";
import { RunService } from "@rbxts/services";
import { GetMousePositionOnCanvas } from "WidgetHandler";
import { CONNECTION_POINT_BORDER_SIZE, CONNECTION_POINT_SIZE } from "./ConnectionPointConfig";
import { StyleColors } from "Style";
import { SimpleLine } from "Components/Lines/SimpleLine";
import { ResetSourceField, SetSourceField } from "FieldsHandler";

interface ConnectionPointOutProps extends NodeFieldProps {
	field: GuiObject;
}

export const ConnectionPointOut = ({ ZIndex, field }: ConnectionPointOutProps) => {
	const connectionPointRef = useRef(undefined as Frame | undefined);

	const [connectionEndPoint, setConnectionEndPoint] = useState(Vector2.zero);

	const [displayConnection, setDisplayConnection] = useState(false);

	const [forceRerender, setForceRerender] = useState(false);

	const callback = (targetPoint: Vector2) => {
		const localTargetPoint = targetPoint.sub(field.AbsolutePosition);

		setConnectionEndPoint(localTargetPoint);
		RunService.UnbindFromRenderStep("MoveConnection");
	};

	useEffect(() => {
		const invertedForceRender = !forceRerender;
		setForceRerender(invertedForceRender);
	}, [connectionPointRef.current?.AbsolutePosition]);

	useEffect(() => {
		print("FRC RNDR");
	}, [forceRerender]);

	useEffect(() => {
		if (displayConnection) {
			SetSourceField(callback);
			bindDrag();
		} else if (!displayConnection) {
			ResetSourceField();
			RunService.UnbindFromRenderStep("MoveConnection");
		}
	}, [displayConnection]);

	const bindDrag = () => {
		RunService.BindToRenderStep("MoveConnection", Enum.RenderPriority.Input.Value, () => {
			const connectionPointPos = connectionPointRef
				.current!.AbsolutePosition.sub(field.AbsolutePosition)
				.add(
					new Vector2(
						CONNECTION_POINT_SIZE.X + CONNECTION_POINT_BORDER_SIZE,
						CONNECTION_POINT_SIZE.Y + CONNECTION_POINT_BORDER_SIZE,
					).mul(0.5),
				);

			const mousePosition = GetMousePositionOnCanvas();
			setConnectionEndPoint(mousePosition);

			setConnectionEndPoint(
				mousePosition.sub(connectionPointRef.current!.AbsolutePosition).add(connectionPointPos),
			);
		});
	};

	return (
		<>
			<frame
				AnchorPoint={new Vector2(1, 0)}
				Position={UDim2.fromScale(1, 0)}
				Size={UDim2.fromScale(1, 1)}
				SizeConstraint={"RelativeYY"}
				BackgroundTransparency={1}
				ref={connectionPointRef}
				ZIndex={ZIndex + 1}
				Event={{
					InputBegan: (_, inputObject) => {
						if (inputObject.UserInputType === Enum.UserInputType.MouseButton1) {
							const displayConnectionInverted = !displayConnection;
							setDisplayConnection(displayConnectionInverted);
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
					BackgroundTransparency={displayConnection ? 0 : 1}
					ZIndex={ZIndex + 2}
				>
					<uicorner CornerRadius={new UDim(1, 0)} />
					<uistroke Color={StyleColors.hex200} Thickness={CONNECTION_POINT_BORDER_SIZE} />
				</frame>
			</frame>

			{displayConnection && (
				<SimpleLine
					startPos={connectionPointRef
						.current!.AbsolutePosition.sub(field.AbsolutePosition)
						.add(
							new Vector2(
								connectionPointRef.current!.AbsoluteSize.X,
								connectionPointRef.current!.AbsoluteSize.Y,
							).mul(0.5),
						)}
					endPos={connectionEndPoint}
					zIndex={ZIndex + 1}
					rerender={forceRerender}
				/>
			)}
		</>
	);
};
