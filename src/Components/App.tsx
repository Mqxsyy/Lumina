import Roact, { useEffect, useRef, useState } from "@rbxts/roact";
import { RunService } from "@rbxts/services";
import { CanvasDataChanged, GetCanvasData, UpdateCanvasData } from "Services/CanvasService";
import { ConnectionsChanged, GetAllConnections, UnbindMovingConnection } from "Services/ConnectionsService";
import { StyleColors } from "Style";
import { GetMousePosition, WidgetSizeChanged } from "Windows/MainWindow";
import { GetWindow, Windows } from "Windows/WindowSevice";
import { GetZoomScale, UpdateZoomScale, ZoomScaleChanged } from "ZoomScale";
import { GetAllSystems, NodeSystemsChanged } from "../Services/NodeSystemService";
import { GetAllNodes, NodesChanged } from "../Services/NodesService";
import { Controls } from "./Controls/Controls";
import { NodeSelection } from "./Selection/NodeSelection";

// TODO: add selecting, copy and paste, group selection moving, undo & redo
// OPTIMIZE: moving one thing makes everything re-render
// OPTIMIZE: implement: useContext?, useMemo, useCallback

export function App() {
	const [widgetSize, setWidgetSize] = useState(GetWindow(Windows.CrescentVFX)!.AbsoluteSize);
	const [zoomScale, setZoomScale] = useState(GetZoomScale());
	const [displayNodeSelection, setDisplayNodeSelection] = useState(undefined as UDim2 | undefined);
	const [_, setForceRender] = useState(0);

	const canvasRef = useRef(undefined as Frame | undefined);
	const canvasDataRef = useRef(GetCanvasData());

	const StartMoveCanvas = (frame: Frame) => {
		const mousePositionVec2 = GetMousePosition();
		const widgetSize = GetWindow(Windows.CrescentVFX)!.AbsoluteSize.mul(0.5);

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

		const canvasData = GetCanvasData();
		const newCanvasPosition = UDim2.fromOffset(widgetSize.X * 0.5, widgetSize.Y * 0.5).add(newPosition);

		if (canvasData.Position !== newCanvasPosition) {
			UpdateCanvasData((canvasData) => {
				canvasData.Position = newCanvasPosition;
				return canvasData;
			}, false);

			UpdateCanvasData((canvasData) => {
				canvasData.Size = UDim2.fromOffset(widgetSize.X, widgetSize.Y).add(
					UDim2.fromOffset(math.abs(newPosition.X.Offset) * 2, math.abs(newPosition.Y.Offset) * 2),
				);

				return canvasData;
			});
		}
	};

	const UpdateZoom = (inputObject: InputObject) => {
		if (inputObject.Position.Z > 0) {
			UpdateZoomScale(0.1);
		} else if (inputObject.Position.Z < 0) {
			UpdateZoomScale(-0.1);
		}
	};

	useEffect(() => {
		const widgetSizeChangedConnection = WidgetSizeChanged.Connect((newSize) => {
			setWidgetSize(newSize as Vector2);

			UpdateCanvasData((canvasData) => {
				canvasData.Position = UDim2.fromOffset(newSize.X * 0.5, newSize.Y * 0.5);
				return canvasData;
			});

			UpdateCanvasData((canvasData) => {
				canvasData.Size = UDim2.fromOffset(newSize.X, newSize.Y);
				return canvasData;
			});
		});

		const zoomChangedConnection = ZoomScaleChanged.Connect((zoom) => {
			setZoomScale(zoom as number);
		});

		const canvasDataChangedConnection = CanvasDataChanged.Connect(() => {
			setForceRender((prevValue) => (prevValue > 10 ? 0 : ++prevValue));
		});

		const nodeSystemsChangedConnection = NodeSystemsChanged.Connect(() => {
			setForceRender((prevValue) => (prevValue > 10 ? 0 : ++prevValue));
		});

		const nodesChangedConnection = NodesChanged.Connect(() => {
			setForceRender((prevValue) => (prevValue > 10 ? 0 : ++prevValue));
		});

		const connectionsChangedConnection = ConnectionsChanged.Connect(() => {
			setForceRender((prevValue) => (prevValue > 10 ? 0 : ++prevValue));
		});

		return () => {
			widgetSizeChangedConnection.Disconnect();
			zoomChangedConnection.Disconnect();
			canvasDataChangedConnection.Disconnect();
			nodeSystemsChangedConnection.Disconnect();
			nodesChangedConnection.Disconnect();
			connectionsChangedConnection.Disconnect();
		};
	}, []);

	return (
		<>
			<frame
				AnchorPoint={new Vector2(0.5, 0.5)}
				Position={canvasDataRef.current.Position}
				Size={canvasDataRef.current.Size}
				BackgroundColor3={StyleColors.Background}
				Event={{
					InputBegan: (_, input: InputObject) => {
						if (input.KeyCode === Enum.KeyCode.Space) {
							const mousePositionVec2 = GetMousePosition();
							setDisplayNodeSelection(UDim2.fromOffset(mousePositionVec2.X, mousePositionVec2.Y));
						} else if (input.UserInputType === Enum.UserInputType.MouseButton1) {
							UnbindMovingConnection(true);
							setDisplayNodeSelection(undefined);
						} else if (input.UserInputType === Enum.UserInputType.MouseButton3) {
							setDisplayNodeSelection(undefined);
						}
					},
				}}
				key={"Background"}
				ref={canvasRef}
			>
				{/* Top Left */}
				<imagelabel
					Position={UDim2.fromOffset(0, 0)}
					Size={UDim2.fromOffset(
						canvasDataRef.current.Size.X.Offset * 0.5,
						canvasDataRef.current.Size.Y.Offset * 0.5,
					)}
					Rotation={180}
					BackgroundTransparency={1}
					// BackgroundTransparency={0.95}
					// BackgroundColor3={Color3.fromRGB(255, 0, 0)}
					Image={"rbxassetid://15952812715"} // alt: 15952811095
					ImageTransparency={0.5}
					ScaleType={"Tile"}
					TileSize={UDim2.fromOffset(100 * zoomScale, 100 * zoomScale)}
				/>
				{/* Bottom Right */}
				<imagelabel
					Position={UDim2.fromOffset(
						canvasDataRef.current.Size.X.Offset * 0.5,
						canvasDataRef.current.Size.Y.Offset * 0.5,
					)}
					Size={UDim2.fromOffset(
						canvasDataRef.current.Size.X.Offset * 0.5,
						canvasDataRef.current.Size.Y.Offset * 0.5,
					)}
					BackgroundTransparency={1}
					// BackgroundTransparency={0.95}
					// BackgroundColor3={Color3.fromRGB(0, 255, 0)}
					Image={"rbxassetid://15952812715"} // alt: 15952811095
					ImageTransparency={0.5}
					ScaleType={"Tile"}
					TileSize={UDim2.fromOffset(100 * zoomScale, 100 * zoomScale)}
				/>
				{/* Top Right */}
				<imagelabel
					Position={
						new UDim2(
							0.5,
							canvasDataRef.current.Size.X.Offset * 0.25 - canvasDataRef.current.Size.Y.Offset * 0.25,
							0,
							canvasDataRef.current.Size.Y.Offset * 0.25 - canvasDataRef.current.Size.X.Offset * 0.25,
						)
					}
					Size={UDim2.fromOffset(
						canvasDataRef.current.Size.Y.Offset * 0.5,
						canvasDataRef.current.Size.X.Offset * 0.5,
					)}
					Rotation={270}
					BackgroundTransparency={1}
					// BackgroundTransparency={0.95}
					// BackgroundColor3={Color3.fromRGB(0, 0, 255)}
					Image={"rbxassetid://15952812715"} // alt: 15952811095
					ImageTransparency={0.5}
					ScaleType={"Tile"}
					TileSize={UDim2.fromOffset(100 * zoomScale, 100 * zoomScale)}
				/>
				{/* Bottom Left */}
				<imagelabel
					Position={
						new UDim2(
							0,
							canvasDataRef.current.Size.X.Offset * 0.25 - canvasDataRef.current.Size.Y.Offset * 0.25,
							0.5,
							canvasDataRef.current.Size.Y.Offset * 0.25 - canvasDataRef.current.Size.X.Offset * 0.25,
						)
					}
					Size={UDim2.fromOffset(
						canvasDataRef.current.Size.Y.Offset * 0.5,
						canvasDataRef.current.Size.X.Offset * 0.5,
					)}
					Rotation={90}
					BackgroundTransparency={1}
					// BackgroundTransparency={0.95}
					// BackgroundColor3={Color3.fromRGB(255, 0, 255)}
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
			{GetAllSystems().map((nodeSystem) => {
				return nodeSystem.create(nodeSystem.data);
			})}
			{GetAllNodes().map((node) => {
				return node.create(node.data);
			})}
			{GetAllConnections().map((connection) => {
				return connection.create(connection.data);
			})}
			{displayNodeSelection !== undefined && (
				<NodeSelection key="NodeSelection" Position={displayNodeSelection} />
			)}
			<Controls key={"Controls"} />
		</>
	);
}
