import Roact, { useEffect, useRef, useState } from "@rbxts/roact";
import { RunService } from "@rbxts/services";
import { ZoomScaleUpdateEvent } from "Events";
import { DeleteNode, GetNode } from "Nodes/NodesHandler";
import { GetMousePosition } from "WidgetHandler";
import { GetZoomScale } from "ZoomScale";

// idk i can't get the index to be actually dynamic with elements reordering properly
// it won't update because object at index 0 goes back to index 0 so it doesn't updates the index of it

// add an ID to the node and use that to reference nodes but keep index for rendering order purposes
// ref gpt
// hook everything inside data object and keep track of ids idk

// store data outside of app and use forced updates to render

interface NodeProps {
	id: number;
	canvasSize: UDim2;
}

export function Node({ id, canvasSize }: NodeProps) {
	const node = GetNode(id);
	const nodeParams = node.Params;

	const [position, setPosition] = useState(nodeParams.AnchorPosition);
	const [offsetFromCenter, setOffsetFromCenter] = useState(Vector2.zero);

	const [zoomScale, setZoomScale] = useState(GetZoomScale()); // need this, can't count on render update cuz node at (0; 0) acts weird idk

	// const [isDragging, setIsDragging] = useState(false);
	// const mouseOffsetRef = useRef(new Vector2(0, 0));

	// const getMouseOffset = (element: Frame) => {
	// 	const mousePosition = GetMousePosition();
	// 	mouseOffsetRef.current = element.AbsolutePosition.sub(mousePosition);
	// };

	// const bindDrag = (i: number) => {
	// 	RunService.BindToRenderStep("MoveNode", Enum.RenderPriority.Input.Value, () => {
	// 		updateAnchorPosition(i, mouseOffsetRef.current);
	// 	});
	// };

	// useEffect(() => {
	// 	if (isDragging) {
	// 		bindDrag(index);
	// 	}

	// 	return () => {
	// 		RunService.UnbindFromRenderStep("MoveNode");
	// 	};
	// });

	useEffect(() => {
		print("ID CHANGED");
	}, [id]);

	useEffect(() => {
		const anchorPositionOffset = nodeParams.AnchorPosition.add(new Vector2(100 * zoomScale, 75 * zoomScale));

		const center = new Vector2(canvasSize.X.Offset * 0.5, canvasSize.Y.Offset * 0.5);
		setOffsetFromCenter(anchorPositionOffset.sub(center).div(zoomScale));

		ZoomScaleUpdateEvent.Event.Connect((zoomScale: number) => {
			setZoomScale(zoomScale);
		});
	}, []);

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
			ZIndex={nodeParams.ZIndex + 1}
			Text={`${id} (${nodeParams.ZIndex})`}
		>
			<frame
				Size={new UDim2(1, 0, 0.1, 0)}
				ZIndex={nodeParams.ZIndex + 2}
				Event={{
					InputBegan: (element, inputObject) => {
						if (inputObject.UserInputType === Enum.UserInputType.MouseButton1) {
							// getMouseOffset(element.Parent as Frame);
							// updateNodeOrder(index);
							// setIsDragging(true);
						} else if (inputObject.UserInputType === Enum.UserInputType.MouseButton2) {
							DeleteNode(id);
						}
					},
					InputEnded: (_, inputObject) => {
						if (inputObject.UserInputType === Enum.UserInputType.MouseButton1) {
							// setIsDragging(false);
							// RunService.UnbindFromRenderStep("MoveNode");
						}
					},
				}}
			/>
		</textbutton>
	);
}
