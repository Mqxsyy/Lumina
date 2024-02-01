import Roact, { useEffect, useRef, useState } from "@rbxts/roact";
import { RunService } from "@rbxts/services";
import { BezierCurve } from "Components/Lines/BezierCurve";
import { StyleColors } from "Style";
import { GetMousePositionOnCanvas } from "WidgetHandler";

// TODO: make connection circle empty and get filled when connection exists

const CONNECTION_POINT_SIZE = new Vector2(10, 10);

export const TextField: NodeField = ({ ZIndex }: NodeFieldParams) => {
	const fieldRef = useRef(undefined as TextLabel | undefined);
	const connectionPointRef = useRef(undefined as Frame | undefined);

	const [connectionEndPoint, setConnectionEndPoint] = useState(Vector2.zero);
	const [displayConnection, setDisplayConnection] = useState(false);

	const bindDrag = () => {
		RunService.BindToRenderStep("MoveConnection", Enum.RenderPriority.Input.Value, () => {
			const connectionPointPos = connectionPointRef
				.current!.AbsolutePosition.sub(fieldRef.current!.AbsolutePosition)
				.add(new Vector2(CONNECTION_POINT_SIZE.X, CONNECTION_POINT_SIZE.Y).mul(0.5));

			const mousePosition = GetMousePositionOnCanvas();

			setConnectionEndPoint(
				mousePosition.sub(connectionPointRef.current!.AbsolutePosition).add(connectionPointPos),
			);
		});
	};

	useEffect(() => {
		if (displayConnection) {
			bindDrag();
		} else if (!displayConnection) {
			RunService.UnbindFromRenderStep("MoveConnection");
		}
	}, [displayConnection]);

	return (
		<textlabel
			Size={new UDim2(1, 0, 0, 20)}
			BackgroundTransparency={1}
			Text={"TEXT FIELD"}
			TextColor3={StyleColors.hex100}
			ZIndex={ZIndex}
			ref={fieldRef}
		>
			<frame
				AnchorPoint={new Vector2(1, 0.5)}
				Position={new UDim2(1, -5, 0.5, 0)}
				Size={UDim2.fromOffset(CONNECTION_POINT_SIZE.X, CONNECTION_POINT_SIZE.Y)}
				BackgroundTransparency={0}
				BackgroundColor3={StyleColors.hex200}
				ZIndex={ZIndex + 1}
				ref={connectionPointRef}
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
			</frame>
			{displayConnection && (
				<BezierCurve
					startPos={connectionPointRef
						.current!.AbsolutePosition.sub(fieldRef.current!.AbsolutePosition)
						.add(new Vector2(CONNECTION_POINT_SIZE.X, CONNECTION_POINT_SIZE.Y).mul(0.5))}
					endPos={connectionEndPoint}
					zIndex={ZIndex + 1}
				/>
			)}
		</textlabel>
	);
};
