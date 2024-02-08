// import Roact, { useEffect, useRef, useState } from "@rbxts/roact";
// import { RunService } from "@rbxts/services";
// import { ZoomScaleUpdateEvent } from "Events";
// import { DeleteNode, UpdateNodePosition } from "Nodes/NodesHandler";
// import { StyleColors, StyleProperties } from "Style";
// import { GetMousePosition } from "WidgetHandler";
// import { GetZoomScale } from "ZoomScale";

// const NODE_SYSTEM_WIDTH = 250;

// export interface NodeSystemParams {
//     AnchorPosition: Vector2;
//     ZIndex: number;
// }

// interface NodeSystemProps {
//     id: number;
// 	canvasData: CanvasData;
// 	nodeParams: NodeParams;
// }

// export function NodeSystem({ id, canvasData, nodeParams }: NodeSystemProps) {
// 	const [position, setPosition] = useState(nodeParams.AnchorPosition);
// 	const [offsetFromCenter, setOffsetFromCenter] = useState(Vector2.zero);

// 	const [zoomScale, setZoomScale] = useState(GetZoomScale());

// 	const mouseOffsetRef = useRef(new Vector2(0, 0));
// 	const [isDragging, setIsDragging] = useState(false);

// 	const getMouseOffset = (element: Frame) => {
// 		const mousePosition = GetMousePosition();
// 		mouseOffsetRef.current = element.AbsolutePosition.sub(mousePosition);
// 	};

// 	useEffect(() => {
// 		if (isDragging) {
// 			RunService.BindToRenderStep("MoveNode", Enum.RenderPriority.Input.Value, () => {
//                 UpdateNodePosition(id, mouseOffsetRef.current);
//             });
// 		}

// 		return () => {
// 			RunService.UnbindFromRenderStep("MoveNode");
// 		};
// 	});

// 	useEffect(() => {
// 		ZoomScaleUpdateEvent.Event.Connect((zoomScale: number) => {
// 			setZoomScale(zoomScale);
// 		});
// 	}, []);

// 	useEffect(() => {
// 		const ySize = (4 + 20 + 7 + fields.size() * (20 + 5)) * 0.5 * zoomScale;
// 		const anchorPositionOffset = nodeParams.AnchorPosition.add(new Vector2(NODE_WIDTH * 0.5 * zoomScale, ySize));

// 		const center = new Vector2(canvasData.size.X.Offset * 0.5, canvasData.size.Y.Offset * 0.5);
// 		setOffsetFromCenter(anchorPositionOffset.sub(center).div(zoomScale));
// 	}, [nodeParams.AnchorPosition]);

// 	useEffect(() => {
// 		const center = new Vector2(canvasData.size.X.Offset / 2, canvasData.size.Y.Offset / 2);
// 		const position = center.add(offsetFromCenter.mul(zoomScale));
// 		setPosition(position);
// 	}, [canvasData.size, offsetFromCenter, zoomScale]);

// 	return (
// 		<textbutton
// 			AnchorPoint={new Vector2(0.5, 0.5)}
// 			Position={UDim2.fromOffset(position.X, position.Y)}
// 			Size={
// 				UDim2.fromOffset(NODE_WIDTH * zoomScale, (4 + 20 + 7 + fields.size() * (20 + 5)) * zoomScale) // padding, header, divider, fields
// 			}
// 			BackgroundColor3={StyleColors.hex800}
// 			Active={true}
// 			AutoButtonColor={false}
// 			ZIndex={nodeParams.ZIndex}
// 		>
// 			<uilistlayout Padding={new UDim(0, 5)} HorizontalAlignment={"Center"} />
// 			<uicorner CornerRadius={StyleProperties.CornerRadius} />
// 			<uipadding
// 				PaddingTop={new UDim(0, 2)}
// 				PaddingRight={new UDim(0, 2)}
// 				PaddingBottom={new UDim(0, 2)}
// 				PaddingLeft={new UDim(0, 2)}
// 			/>

// 			<textlabel
// 				Size={new UDim2(1, 0, 0, 20)}
// 				BackgroundTransparency={0}
// 				BackgroundColor3={StyleColors.hex700}
// 				ZIndex={nodeParams.ZIndex + 1}
// 				FontFace={new Font(StyleProperties.FontId, Enum.FontWeight.Bold)}
// 				TextColor3={StyleColors.hex100}
// 				Text={nodeParams.Name}
// 				TextScaled={true}
// 				Event={{
// 					InputBegan: (element, inputObject) => {
// 						if (inputObject.UserInputType === Enum.UserInputType.MouseButton1) {
// 							getMouseOffset(element.Parent as Frame);
// 							setIsDragging(true);
// 						} else if (inputObject.UserInputType === Enum.UserInputType.MouseButton2) {
// 							if (canvasData.isMoving) return;
// 							DeleteNode(id);
// 						}
// 					},
// 					InputEnded: (_, inputObject) => {
// 						if (inputObject.UserInputType === Enum.UserInputType.MouseButton1) {
// 							setIsDragging(false);
// 							RunService.UnbindFromRenderStep("MoveNode");
// 						}
// 					},
// 				}}
// 			>
// 				<uicorner CornerRadius={StyleProperties.CornerRadius} />
// 			</textlabel>
// 			<frame
// 				Size={new UDim2(1, 0, 0, 2)}
// 				BackgroundTransparency={0}
// 				BackgroundColor3={StyleColors.hex600}
// 				ZIndex={nodeParams.ZIndex + 1}
// 			/>
// 			{fields.map((field) => {
// 				return field({ ZIndex: nodeParams.ZIndex + 1 });
// 			})}
// 		</textbutton>
// 	);
// }
