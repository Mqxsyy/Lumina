import Roact, { PureComponent, useEffect, useRef, useState } from "@rbxts/roact";
import { RunService } from "@rbxts/services";
import { ZoomScaleUpdateEvent } from "Events";
import { GetMousePosition } from "WidgetHandler";
import { GetZoomScale } from "ZoomScale";

interface NodeProps {
	index: number;
	canvasSize: UDim2;
	anchorPosition: Vector2;
	updateNodeOrder: (index: number) => void;
	updateAnchorPosition: (index: number, offset: Vector2) => void;
	removeNode: (index: number) => void;
}

export function Node({
	index,
	canvasSize,
	anchorPosition,
	updateNodeOrder,
	updateAnchorPosition,
	removeNode,
}: NodeProps) {
	const [position, setPosition] = useState(anchorPosition);
	const [offsetFromCenter, setOffsetFromCenter] = useState(Vector2.zero);

	const [zoomScale, setZoomScale] = useState(GetZoomScale()); // need this, can't count on render update cuz node at (0; 0) acts weird idk

	const isDraggingRef = useRef(false);
	const mouseOffsetRef = useRef(new Vector2(0, 0));

	const getMouseOffset = (element: Frame) => {
		const mousePosition = GetMousePosition();
		mouseOffsetRef.current = element.AbsolutePosition.sub(mousePosition);
	};

	const bindDrag = (i: number) => {
		RunService.BindToRenderStep("MoveNode", Enum.RenderPriority.Input.Value, () => {
			updateAnchorPosition(i, mouseOffsetRef.current);
		});
	};

	useEffect(() => {
		print(isDraggingRef.current);

		if (isDraggingRef.current) {
			bindDrag(index);
		}

		return () => {
			RunService.UnbindFromRenderStep("MoveNode");
		};
	});

	useEffect(() => {
		const anchorPositionOffset = anchorPosition.add(new Vector2(100 * zoomScale, 75 * zoomScale));

		const center = new Vector2(canvasSize.X.Offset * 0.5, canvasSize.Y.Offset * 0.5);
		setOffsetFromCenter(anchorPositionOffset.sub(center).div(zoomScale));

		ZoomScaleUpdateEvent.Event.Connect((zoomScale: number) => {
			setZoomScale(zoomScale);
		});
	}, []);

	useEffect(() => {
		const anchorPositionOffset = anchorPosition.add(new Vector2(100 * zoomScale, 75 * zoomScale));

		const center = new Vector2(canvasSize.X.Offset * 0.5, canvasSize.Y.Offset * 0.5);
		setOffsetFromCenter(anchorPositionOffset.sub(center).div(zoomScale));
	}, [anchorPosition]);

	useEffect(() => {
		const center = new Vector2(canvasSize.X.Offset / 2, canvasSize.Y.Offset / 2);
		const position = center.add(offsetFromCenter.mul(zoomScale));
		setPosition(position);
	}, [canvasSize, offsetFromCenter, zoomScale]);

	return (
		<textbutton
			AnchorPoint={new Vector2(0.5, 0.5)}
			Position={UDim2.fromOffset(position.X, position.Y)}
			Size={UDim2.fromOffset(200 * zoomScale, 150 * zoomScale)}
			BackgroundColor3={Color3.fromHex("#FFFFFF")}
			Active={true}
			AutoButtonColor={false}
			ZIndex={index + 1}
		>
			<frame
				Size={new UDim2(1, 0, 0.1, 0)}
				ZIndex={index + 2}
				Event={{
					InputBegan: (element, inputObject) => {
						if (inputObject.UserInputType === Enum.UserInputType.MouseButton1) {
							getMouseOffset(element.Parent as Frame);
							isDraggingRef.current = true;
							updateNodeOrder(index);
						} else if (inputObject.UserInputType === Enum.UserInputType.MouseButton2) {
							removeNode(index);
						}
					},
					InputEnded: (_, inputObject) => {
						if (inputObject.UserInputType === Enum.UserInputType.MouseButton1) {
							isDraggingRef.current = false;
							RunService.UnbindFromRenderStep("MoveNode");
						}
					},
				}}
			/>
		</textbutton>
	);
}
