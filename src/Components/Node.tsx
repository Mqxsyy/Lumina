import Roact, { useEffect, useState } from "@rbxts/roact";
import { RunService } from "@rbxts/services";
import { ZoomScaleUpdateEvent } from "Events";
import { GetMousePosition } from "WidgetHandler";
import { GetZoomScale } from "ZoomScale";

let mouseOffset = Vector2.zero;

function SelectNodeTitleBar(
	element: Frame,
	index: number,
	updateAnchorPosition: (index: number, offset: Vector2) => void,
) {
	const mousePosition = GetMousePosition();
	mouseOffset = element.AbsolutePosition.sub(mousePosition);

	RunService.BindToRenderStep("MoveNode", Enum.RenderPriority.Input.Value, () => {
		updateAnchorPosition(index, mouseOffset);
	});
}

function DeselectNodeTitleBar(inputObject: InputObject) {
	if (inputObject.UserInputType !== Enum.UserInputType.MouseButton1) return;
	RunService.UnbindFromRenderStep("MoveNode");
}

interface NodeProps {
	index: number;
	canvasSize: UDim2;
	anchorPosition: Vector2;
	updateAnchorPosition: (index: number, offset: Vector2) => void;
	removeNode: (index: number) => void;
}

export function Node({ index, canvasSize, anchorPosition, updateAnchorPosition, removeNode }: NodeProps) {
	const [position, setPosition] = useState(anchorPosition);
	const [offsetFromCenter, setOffsetFromCenter] = useState(Vector2.zero);

	const [zoomScale, setZoomScale] = useState(GetZoomScale()); // need this, can't count on render update cuz node at (0; 0) acts weird idk

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
			ZIndex={index}
		>
			<frame
				Size={new UDim2(1, 0, 0.1, 0)}
				Event={{
					InputBegan: (element, inputObject) => {
						if (inputObject.UserInputType === Enum.UserInputType.MouseButton1) {
							SelectNodeTitleBar(element.Parent as Frame, index, updateAnchorPosition);
						} else if (inputObject.UserInputType === Enum.UserInputType.MouseButton2) {
							removeNode(index);
						}
					},
					InputEnded: (_, inputObject) => DeselectNodeTitleBar(inputObject),
				}}
			/>
		</textbutton>
	);
}
