import Roact, { useEffect, useState } from "@rbxts/roact";
import { RunService } from "@rbxts/services";
import { CanvasSizeChanged, GetCanvasFrame, ZoomScaleUpdateEvent } from "Events";
import { GetMousePositionOnCanvas } from "WidgetHandler";
import { GetZoomScale } from "ZoomScale";

// TODO: fix jitteriness, probs due to delayed update frame
// omfg y dis soo hard to fix

let mouseOffset = Vector2.zero;

function SelectNodeTitleBar(element: Frame, inputObject: InputObject, setPosition: (position: Vector2) => void) {
	if (inputObject.UserInputType !== Enum.UserInputType.MouseButton1) return;

	const mousePosition = GetMousePositionOnCanvas();
	mouseOffset = element.AbsolutePosition.sub(mousePosition);

	// dumb? fix for element display order
	// yes zindex exists but it won't leave it above other elements
	const elementParent = element.Parent;
	element.Parent = undefined;
	element.Parent = elementParent;

	RunService.BindToRenderStep("MoveNode", Enum.RenderPriority.Input.Value, () => MoveNode(setPosition));
}

function DeselectNodeTitleBar(inputObject: InputObject) {
	if (inputObject.UserInputType !== Enum.UserInputType.MouseButton1) return;
	RunService.UnbindFromRenderStep("MoveNode");
}

function MoveNode(setCenterOffset: (position: Vector2) => void) {
	const zoomScale = GetZoomScale();
	const canvas = GetCanvasFrame.Invoke() as Frame;

	const mousePosition = GetMousePositionOnCanvas().add(new Vector2(100 * zoomScale, 75 * zoomScale));

	const center = new Vector2(canvas.AbsoluteSize.X * 0.5, canvas.AbsoluteSize.Y * 0.5);
	setCenterOffset(mousePosition.sub(center).add(mouseOffset).div(zoomScale));
}

export function Node() {
	const [position, setPosition] = useState(Vector2.zero);

	const [zoomScale, setZoomScale] = useState(GetZoomScale()); // need this, can't count on render update cuz node at (0; 0) acts weird idk

	const [centerOffset, setCenterOffset] = useState(Vector2.zero);

	const canvas = GetCanvasFrame.Invoke() as Frame;
	const [canvasSize, setCanvasSize] = useState(canvas.AbsoluteSize);

	useEffect(() => {
		const mousePosition = GetMousePositionOnCanvas().add(new Vector2(100 * zoomScale, 75 * zoomScale));

		const center = new Vector2(canvasSize.X * 0.5, canvasSize.Y * 0.5);
		setCenterOffset(mousePosition.sub(center).div(zoomScale));

		ZoomScaleUpdateEvent.Event.Connect((zoomScale: number) => {
			setZoomScale(zoomScale);
		});

		CanvasSizeChanged.Event.Connect((size: Vector2) => {
			setCanvasSize(size);
		});

		// canvas.GetPropertyChangedSignal("AbsoluteSize").Connect(() => {
		// 	setCanvasSize(canvas.AbsoluteSize);
		// });
	}, []);

	useEffect(() => {
		const center = new Vector2(canvasSize.X / 2, canvasSize.Y / 2);
		const position = center.add(centerOffset.mul(zoomScale));
		setPosition(position);
	}, [canvasSize, centerOffset, zoomScale]);

	return (
		<textbutton
			AnchorPoint={new Vector2(0.5, 0.5)}
			Position={UDim2.fromOffset(position.X, position.Y)}
			Size={UDim2.fromOffset(200 * zoomScale, 150 * zoomScale)}
			BackgroundColor3={Color3.fromHex("#FFFFFF")}
			Active={true}
			AutoButtonColor={false}
		>
			<frame
				Size={new UDim2(1, 0, 0.1, 0)}
				Event={{
					InputBegan: (element, inputObject) =>
						SelectNodeTitleBar(element.Parent as Frame, inputObject, setCenterOffset),
					InputEnded: (_, inputObject) => DeselectNodeTitleBar(inputObject),
				}}
			/>
		</textbutton>
	);
}
