import Roact, { useEffect, useRef, useState } from "@rbxts/roact";
import { RunService } from "@rbxts/services";
import { GetMousePosition, GetWidget, WidgetSizeChanged } from "WidgetHandler";
import { GetZoomScale, UpdateZoomScale, ZoomScaleChanged } from "ZoomScale";
import { StyleColors } from "Style";
import { GetCanvas } from "Events";
import { Controls } from "./Controls";
import { NodeSelection } from "./NodeSelection";

// TODO: make zoom go to mouse

export function App() {
	const canvasRef = useRef(undefined as Frame | undefined);
	GetCanvas.OnInvoke = () => canvasRef.current;

	const [widgetSize, setWidgetSize] = useState(GetWidget().AbsoluteSize);

	const [canvasPosition, setCanvasPosition] = useState(UDim2.fromOffset(0, 0));
	const [canvasSize, setCanvasSize] = useState(UDim2.fromOffset(widgetSize.X, widgetSize.Y));

	const [zoomScale, setZoomScale] = useState(GetZoomScale());

	const [displayNodeSelection, setDisplayNodeSelection] = useState(undefined as UDim2 | undefined);

	const StartMoveCanvas = (frame: Frame) => {
		const mousePositionVec2 = GetMousePosition();
		const widgetSize = GetWidget().AbsoluteSize.mul(0.5);

		const mousePosition = UDim2.fromOffset(mousePositionVec2.X, mousePositionVec2.Y);
		const mouseOffset = mousePosition.sub(frame.Position).add(UDim2.fromOffset(widgetSize.X, widgetSize.Y));

		RunService.BindToRenderStep("MoveCanvas", Enum.RenderPriority.Input.Value, () => MoveCanvas(mouseOffset));
	};

	const EndMoveCanvas = () => {
		RunService.UnbindFromRenderStep("MoveCanvas");
	};

	const MoveCanvas = (mouseOffset: UDim2) => {
		const mousePositionVec2 = GetMousePosition();
		const mousePosition = UDim2.fromOffset(mousePositionVec2.X, mousePositionVec2.Y);

		const newPosition = mousePosition.sub(mouseOffset);
		setCanvasPosition(newPosition);
	};

	const UpdateZoom = (inputObject: InputObject) => {
		if (inputObject.Position.Z > 0) {
			UpdateZoomScale(0.1);
		} else if (inputObject.Position.Z < 0) {
			UpdateZoomScale(-0.1);
		}
	};

	useEffect(() => {
		WidgetSizeChanged.Connect((size) => {
			setWidgetSize(size as Vector2);
		});

		ZoomScaleChanged.Connect((zoom) => {
			setZoomScale(zoom as number);
		});
	}, []);

	useEffect(() => {
		const size = UDim2.fromOffset(widgetSize.X, widgetSize.Y).add(
			UDim2.fromOffset(math.abs(canvasPosition.X.Offset * 2), math.abs(canvasPosition.Y.Offset * 2)),
		);

		setCanvasSize(size);
	}, [widgetSize, canvasPosition]);

	return (
		<>
			<frame
				AnchorPoint={new Vector2(0.5, 0.5)}
				Position={UDim2.fromOffset(widgetSize.X * 0.5, widgetSize.Y * 0.5).add(canvasPosition)}
				Size={canvasSize}
				BackgroundColor3={StyleColors.hex900}
				Event={{
					InputBegan: (_, inputObject: InputObject) => {
						if (inputObject.KeyCode === Enum.KeyCode.Space) {
							const mousePositionVec2 = GetMousePosition();
							setDisplayNodeSelection(UDim2.fromOffset(mousePositionVec2.X, mousePositionVec2.Y));
						} else if (
							inputObject.UserInputType === Enum.UserInputType.MouseButton1 ||
							inputObject.UserInputType === Enum.UserInputType.MouseButton3
						) {
							setDisplayNodeSelection(undefined);
						}
					},
				}}
				ref={canvasRef}
			>
				<imagelabel
					Position={UDim2.fromOffset(0, 0)}
					Size={UDim2.fromOffset(canvasSize.X.Offset * 0.5, canvasSize.Y.Offset * 0.5)}
					Rotation={180}
					BackgroundTransparency={1}
					Image={"rbxassetid://15952812715"} // alt: 15952811095
					ImageTransparency={0.5}
					ScaleType={"Tile"}
					TileSize={UDim2.fromOffset(100 * zoomScale, 100 * zoomScale)}
				/>
				<imagelabel
					Position={UDim2.fromOffset(canvasSize.X.Offset * 0.5, canvasSize.Y.Offset * 0.5)}
					Size={UDim2.fromOffset(canvasSize.X.Offset * 0.5, canvasSize.Y.Offset * 0.5)}
					BackgroundTransparency={1}
					Image={"rbxassetid://15952812715"} // alt: 15952811095
					ImageTransparency={0.5}
					ScaleType={"Tile"}
					TileSize={UDim2.fromOffset(100 * zoomScale, 100 * zoomScale)}
				/>
				<imagelabel
					Position={
						new UDim2(
							0.5,
							canvasSize.X.Offset * 0.25 - canvasSize.Y.Offset * 0.25,
							0,
							canvasSize.Y.Offset * 0.25 - canvasSize.X.Offset * 0.25,
						)
					}
					Size={UDim2.fromOffset(canvasSize.Y.Offset * 0.5, canvasSize.X.Offset * 0.5)}
					Rotation={270}
					BackgroundTransparency={1}
					Image={"rbxassetid://15952812715"} // alt: 15952811095
					ImageTransparency={0.5}
					ScaleType={"Tile"}
					TileSize={UDim2.fromOffset(100 * zoomScale, 100 * zoomScale)}
				/>
				<imagelabel
					Position={
						new UDim2(
							0,
							canvasSize.X.Offset * 0.25 - canvasSize.Y.Offset * 0.25,
							0.5,
							canvasSize.Y.Offset * 0.25 - canvasSize.X.Offset * 0.25,
						)
					}
					Size={UDim2.fromOffset(canvasSize.Y.Offset * 0.5, canvasSize.X.Offset * 0.5)}
					Rotation={90}
					BackgroundTransparency={1}
					Image={"rbxassetid://15952812715"} // alt: 15952811095
					ImageTransparency={0.5}
					ScaleType={"Tile"}
					TileSize={UDim2.fromOffset(100 * zoomScale, 100 * zoomScale)}
				/>
				<frame
					Size={UDim2.fromScale(1, 1)}
					BackgroundTransparency={1}
					Event={{
						InputBegan: (element, inputObject: InputObject) => {
							if (inputObject.UserInputType !== Enum.UserInputType.MouseButton3) return;
							StartMoveCanvas(element.Parent as Frame);
						},
						InputEnded: (_, inputObject: InputObject) => {
							if (inputObject.UserInputType !== Enum.UserInputType.MouseButton3) return;
							EndMoveCanvas();
						},
						InputChanged: (_, inputObject: InputObject) => {
							if (inputObject.UserInputType !== Enum.UserInputType.MouseWheel) return;
							UpdateZoom(inputObject);
						},
					}}
				/>
			</frame>
			<Controls />
			{displayNodeSelection !== undefined && <NodeSelection Position={displayNodeSelection} />}
		</>
	);
}
