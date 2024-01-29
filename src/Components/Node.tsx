import Roact, { useEffect, useRef, useState } from "@rbxts/roact";
import { RunService } from "@rbxts/services";
import { ZoomScaleUpdateEvent } from "Events";
import { DeleteNode, UpdateNodePosition } from "Nodes/NodesHandler";
import { StyleColors, StyleProperties } from "Style";
import { GetMousePosition } from "WidgetHandler";
import { GetZoomScale } from "ZoomScale";

interface NodeProps {
	id: number;
	canvasData: CanvasData;
	nodeParams: NodeParams;
	data?: {};
}

export function Node({ id, canvasData, nodeParams }: NodeProps) {
	const [position, setPosition] = useState(nodeParams.AnchorPosition);
	const [offsetFromCenter, setOffsetFromCenter] = useState(Vector2.zero);

	const [zoomScale, setZoomScale] = useState(GetZoomScale()); // need this, can't count on render update cuz node at (0; 0) acts weird idk

	const [isDragging, setIsDragging] = useState(false);
	const mouseOffsetRef = useRef(new Vector2(0, 0));

	const getMouseOffset = (element: Frame) => {
		const mousePosition = GetMousePosition();
		mouseOffsetRef.current = element.AbsolutePosition.sub(mousePosition);
	};

	const bindDrag = () => {
		RunService.BindToRenderStep("MoveNode", Enum.RenderPriority.Input.Value, () => {
			UpdateNodePosition(id, mouseOffsetRef.current);
		});
	};

	useEffect(() => {
		if (isDragging) {
			bindDrag();
		}

		return () => {
			RunService.UnbindFromRenderStep("MoveNode");
		};
	});

	useEffect(() => {
		ZoomScaleUpdateEvent.Event.Connect((zoomScale: number) => {
			setZoomScale(zoomScale);
		});
	}, []);

	useEffect(() => {
		const anchorPositionOffset = nodeParams.AnchorPosition.add(new Vector2(100 * zoomScale, 75 * zoomScale));

		const center = new Vector2(canvasData.size.X.Offset * 0.5, canvasData.size.Y.Offset * 0.5);
		setOffsetFromCenter(anchorPositionOffset.sub(center).div(zoomScale));
	}, [nodeParams.AnchorPosition]);

	useEffect(() => {
		const center = new Vector2(canvasData.size.X.Offset / 2, canvasData.size.Y.Offset / 2);
		const position = center.add(offsetFromCenter.mul(zoomScale));
		setPosition(position);
	}, [canvasData.size, offsetFromCenter, zoomScale]);

	return (
		<textbutton
			AnchorPoint={new Vector2(0.5, 0.5)}
			Position={UDim2.fromOffset(position.X, position.Y)}
			Size={UDim2.fromOffset(200 * zoomScale, 150 * zoomScale)}
			BackgroundColor3={StyleColors.hex800}
			Active={true}
			AutoButtonColor={false}
			Text={`${id}`}
			ZIndex={nodeParams.ZIndex}
		>
			<uilistlayout Padding={new UDim(0, 5)} HorizontalAlignment={"Center"} />
			<uicorner CornerRadius={StyleProperties.CornerRadius} />
			<uipadding
				PaddingTop={new UDim(0.01, 2)}
				PaddingRight={new UDim(0.01, 2)}
				PaddingBottom={new UDim(0.01, 2)}
				PaddingLeft={new UDim(0.01, 2)}
			/>

			<textlabel
				Size={new UDim2(1, 0, 0.15, 0)}
				BackgroundTransparency={0}
				BackgroundColor3={StyleColors.hex700}
				ZIndex={nodeParams.ZIndex + 1}
				FontFace={new Font(StyleProperties.FontId, Enum.FontWeight.Bold)}
				TextColor3={StyleColors.hex100}
				Text={"Blank node"}
				TextScaled={true}
				Event={{
					InputBegan: (element, inputObject) => {
						if (inputObject.UserInputType === Enum.UserInputType.MouseButton1) {
							getMouseOffset(element.Parent as Frame);
							setIsDragging(true);
						} else if (inputObject.UserInputType === Enum.UserInputType.MouseButton2) {
							if (canvasData.isMoving) return;
							DeleteNode(id);
						}
					},
					InputEnded: (_, inputObject) => {
						if (inputObject.UserInputType === Enum.UserInputType.MouseButton1) {
							setIsDragging(false);
							RunService.UnbindFromRenderStep("MoveNode");
						}
					},
				}}
			>
				<uicorner CornerRadius={StyleProperties.CornerRadius} />
			</textlabel>
			<frame Size={new UDim2(1, 0, 0, 2)} BackgroundTransparency={0} BackgroundColor3={StyleColors.hex600} />
		</textbutton>
	);
}
