import Roact, { useEffect, useRef, useState } from "@rbxts/roact";
import { RunService } from "@rbxts/services";
import { ZoomScaleUpdateEvent } from "Events";
import { CreateNode, PlacedNodes } from "Nodes";
import { GetMousePosition, GetMousePositionOnCanvas, GetWidget } from "WidgetHandler";
import { GetLastZoomScale, GetZoomScale, SetZoomScale, ZoomScaleConstraint } from "ZoomScale";

// TODO: add widget size tracking

function MakeNode(inputObject: InputObject) {
	if (inputObject.KeyCode === Enum.KeyCode.Space) {
		CreateNode();
	}
}

let mouseOffset = UDim2.fromOffset(0, 0);
function StartMoveCanvas(frame: Frame, inputObject: InputObject, setCanvasPosition: (position: UDim2) => void) {
	if (inputObject.UserInputType !== Enum.UserInputType.MouseButton3) return;

	const mousePositionVec2 = GetMousePosition();
	const mousePosition = UDim2.fromOffset(mousePositionVec2.X, mousePositionVec2.Y);

	const widgetSize = GetWidget().AbsoluteSize.mul(0.5);

	mouseOffset = mousePosition.sub(frame.Position).add(UDim2.fromOffset(widgetSize.X, widgetSize.Y));

	RunService.BindToRenderStep("MoveCanvas", Enum.RenderPriority.Input.Value, () => MoveCanvas(setCanvasPosition));
}

function EndMoveCanvas(inputObject: InputObject) {
	if (inputObject.UserInputType !== Enum.UserInputType.MouseButton3) return;
	RunService.UnbindFromRenderStep("MoveCanvas");
}

function MoveCanvas(setCanvasPosition: (position: UDim2) => void) {
	const mousePositionVec2 = GetMousePosition();
	const mousePosition = UDim2.fromOffset(mousePositionVec2.X, mousePositionVec2.Y);

	const newPosition = mousePosition.sub(mouseOffset);

	setCanvasPosition(newPosition);
}

function UpdateZoom(inputObject: InputObject) {
	if (inputObject.UserInputType === Enum.UserInputType.MouseWheel) {
		if (inputObject.Position.Z > 0) {
			const newZoomScale = GetZoomScale() + 0.1;
			if (newZoomScale > ZoomScaleConstraint.max) {
				SetZoomScale(ZoomScaleConstraint.max);
			} else {
				SetZoomScale(newZoomScale);
			}
		} else if (inputObject.Position.Z < 0) {
			const newZoomScale = GetZoomScale() - 0.1;
			if (newZoomScale < ZoomScaleConstraint.min) {
				SetZoomScale(ZoomScaleConstraint.min);
			} else {
				SetZoomScale(newZoomScale);
			}
		}
	}
}

interface AppProps {
	fn: (frame: Frame) => void;
}

export function App({ fn }: AppProps) {
	const canvasRef = useRef(undefined as Frame | undefined);

	const [widgetSize, setWidgetSize] = useState(GetWidget().AbsoluteSize);

	const [canvasPosition, setCanvasPosition] = useState(UDim2.fromOffset(0, 0));
	const [canvasSize, setCanvasSize] = useState(UDim2.fromOffset(widgetSize.X, widgetSize.Y));

	const [zoomScale, setZoomScale] = useState(GetZoomScale());

	useEffect(() => {
		fn(canvasRef.current as Frame);

		ZoomScaleUpdateEvent.Event.Connect((zoomScale: number) => {
			const mousePosition = GetMousePositionOnCanvas();
			const delta = -(1 - zoomScale / GetLastZoomScale());

			const canvasOffset = mousePosition.mul(delta);

			const currentPos = canvasRef.current!.Position;
			const newPosition = UDim2.fromOffset(
				currentPos.X.Offset - canvasOffset.X,
				currentPos.Y.Offset - canvasOffset.Y,
			);

			setCanvasPosition(newPosition);
			setZoomScale(zoomScale);
		});
	}, []);

	useEffect(() => {
		setCanvasSize(
			UDim2.fromOffset(widgetSize.X * zoomScale, widgetSize.Y * zoomScale).add(
				UDim2.fromOffset(math.abs(canvasPosition.X.Offset * 2), math.abs(canvasPosition.Y.Offset * 2)),
			),
		);
	}, [canvasPosition]);

	return (
		<frame
			AnchorPoint={new Vector2(0.5, 0.5)}
			Position={UDim2.fromOffset(widgetSize.X * 0.5, widgetSize.Y * 0.5).add(canvasPosition)}
			Size={canvasSize}
			BackgroundColor3={Color3.fromHex("#1B1B1B")}
			Event={{
				InputBegan: (_, inputObject: InputObject) => {
					MakeNode(inputObject);
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
			{...PlacedNodes}
			<frame
				Size={UDim2.fromScale(1, 1)}
				BackgroundTransparency={1}
				Event={{
					InputBegan: (element, inputObject: InputObject) =>
						StartMoveCanvas(element.Parent as Frame, inputObject, setCanvasPosition),
					InputEnded: (_, inputObject: InputObject) => EndMoveCanvas(inputObject),
					InputChanged: (_, inputObject: InputObject) => UpdateZoom(inputObject),
				}}
			/>
		</frame>
	);
}
