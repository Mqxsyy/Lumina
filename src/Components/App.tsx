import Roact, { useEffect, useRef, useState } from "@rbxts/roact";
import { RunService } from "@rbxts/services";
import { NodesChanged, ZoomScaleUpdateEvent } from "Events";
import { GetMousePosition, GetMousePositionOnCanvas, GetWidget } from "WidgetHandler";
import { GetZoomScale, SetZoomScale, ZoomScaleConstraint } from "ZoomScale";
import { GetNodeCollection } from "Nodes/NodesHandler";
import { NodeSelection } from "./NodeSelection";
import { StyleColorHexes, StyleColors } from "Style";

// TODO: add widget size tracking
// TODO: make zoom go to mouse

interface AppProps {
	fn: (frame: Frame) => void;
}

export function App({ fn }: AppProps) {
	const canvasRef = useRef(undefined as Frame | undefined);

	const [widgetSize, setWidgetSize] = useState(GetWidget().AbsoluteSize);

	const [canvasPosition, setCanvasPosition] = useState(UDim2.fromOffset(0, 0));
	const [canvasSize, setCanvasSize] = useState(UDim2.fromOffset(widgetSize.X, widgetSize.Y));

	const [zoomScale, setZoomScale] = useState(GetZoomScale());

	const isDraggingRef = useRef(false);
	const [_, setNodesChanged] = useState(false);

	const [nodeSelectionPosition, setNodeSelectionPosition] = useState(new Vector2(0, 0));
	const [displayNodeSelection, setDisplayNodeSelection] = useState(false);

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
	};

	useEffect(() => {
		fn(canvasRef.current as Frame);

		// force re-render when nodes change
		NodesChanged.Event.Connect(() => {
			setNodesChanged((prevValue) => !prevValue);
		});

		ZoomScaleUpdateEvent.Event.Connect((zoomScale: number) => {
			// const delta = -(1 - zoomScale / GetLastZoomScale());

			/*
			// const mousePosition = GetMousePositionOnCanvas();
			// const canvasOffset = mousePosition.mul(delta);

			// const currentPos = canvasRef.current!.Position;
			// const newPosition = UDim2.fromOffset(
			// 	currentPos.X.Offset - canvasOffset.X,
			// 	currentPos.Y.Offset - canvasOffset.Y,
			// );
            
            // setCanvasPosition(newPosition);
            */

			// const mousePositionVec2 = GetMousePosition().mul(delta);
			// const mousePosition = UDim2.fromOffset(mousePositionVec2.X, mousePositionVec2.Y);

			// const widgetSize = GetWidget().AbsoluteSize.mul(0.5);

			// mouseOffset = canvasRef
			// 	.current!.Position.sub(mousePosition)
			// 	.add(UDim2.fromOffset(widgetSize.X, widgetSize.Y));

			// const currentPos = canvasRef.current!.Position;
			// const newPosition = UDim2.fromOffset(
			// 	currentPos.X.Offset - mouseOffset.X.Offset,
			// 	currentPos.Y.Offset - mouseOffset.Y.Offset,
			// );

			// setCanvasPosition(mousePosition);
			setZoomScale(zoomScale);
		});
	}, []);

	useEffect(() => {
		const size = UDim2.fromOffset(widgetSize.X, widgetSize.Y).add(
			UDim2.fromOffset(math.abs(canvasPosition.X.Offset * 2), math.abs(canvasPosition.Y.Offset * 2)),
		);

		setCanvasSize(size);
	}, [canvasPosition]);

	return (
		<frame
			AnchorPoint={new Vector2(0.5, 0.5)}
			Position={UDim2.fromOffset(widgetSize.X * 0.5, widgetSize.Y * 0.5).add(canvasPosition)}
			Size={canvasSize}
			BackgroundColor3={StyleColors.hex900}
			Event={{
				InputBegan: (_, inputObject: InputObject) => {
					if (inputObject.KeyCode === Enum.KeyCode.Space) {
						setNodeSelectionPosition(GetMousePositionOnCanvas());
						setDisplayNodeSelection(true);
					} else if (
						inputObject.UserInputType === Enum.UserInputType.MouseButton1 ||
						inputObject.UserInputType === Enum.UserInputType.MouseButton3
					) {
						setDisplayNodeSelection(false);
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
			{GetNodeCollection().map((node) => {
				const canvasData: CanvasData = {
					size: canvasSize,
					isMoving: isDraggingRef.current,
				};
				return node.Node(node.Id, canvasData, node.Params);
			})}
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
			{displayNodeSelection && (
				<NodeSelection position={nodeSelectionPosition} closeSelection={() => setDisplayNodeSelection(false)} />
			)}
		</frame>
	);
}
