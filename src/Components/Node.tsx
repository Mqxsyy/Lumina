import Roact, { useEffect, useState } from "@rbxts/roact";
import { RunService } from "@rbxts/services";
import { GetCanvasFrame, ZoomScaleUpdateEvent } from "Events";
import { GetMousePosition, GetMousePositionOnCanvas, GetWidget } from "WidgetHandler";
import { GetZoomScale } from "ZoomScale";

// TODO: fix moving and zooming

// let mouseOffset = Vector2.zero;

// function SelectNodeTitleBar(element: Frame, inputObject: InputObject, setPosition: (position: Vector2) => void) {
// 	if (inputObject.UserInputType !== Enum.UserInputType.MouseButton1) return;

// 	const elementPosition = new Vector2(element.Position.X.Offset, element.Position.Y.Offset);
// 	mouseOffset = GetMousePositionOnCanvas().sub(elementPosition);

// 	// dumb? fix for element display order
// 	// yes zindex exists but it won't leave it above other elements
// 	const elementParent = element.Parent;
// 	element.Parent = undefined;
// 	element.Parent = elementParent;

// 	RunService.BindToRenderStep("MoveNode", Enum.RenderPriority.Input.Value, () => MoveNode(setPosition));
// }

// function DeselectNodeTitleBar(inputObject: InputObject) {
// 	if (inputObject.UserInputType !== Enum.UserInputType.MouseButton1) return;
// 	RunService.UnbindFromRenderStep("MoveNode");
// }

// function MoveNode(setPosition: (position: Vector2) => void) {
// 	const mousePosition = GetMousePositionOnCanvas();

// 	const newPosition = mousePosition.sub(mouseOffset);
// 	const newX = newPosition.X / GetZoomScale();
// 	const newY = newPosition.Y / GetZoomScale();

// 	setPosition(new Vector2(newX, newY));
// }

export function Node() {
	const [position, setPosition] = useState(Vector2.zero);

	const [zoomScale, setZoomScale] = useState(GetZoomScale()); // need this, can't count on render update cuz node at (0; 0) acts weird idk

	const canvas = GetCanvasFrame.Invoke() as Frame;
	const [canvasSize, setCanvasSize] = useState(canvas.AbsoluteSize);
	const [centerOffset, setCenterOffset] = useState(Vector2.zero);

	useEffect(() => {
		const mousePosition = GetMousePositionOnCanvas();

		const center = new Vector2(canvasSize.X / 2, canvasSize.Y / 2);
		setCenterOffset(mousePosition.sub(center));

		canvas.GetPropertyChangedSignal("AbsoluteSize").Connect(() => {
			setCanvasSize(canvas.AbsoluteSize);
		});
	}, []);

	useEffect(() => {
		const center = new Vector2(canvasSize.X / 2, canvasSize.Y / 2);
		const position = center.add(centerOffset);
		setPosition(position);
	}, [canvasSize, centerOffset]);

	// useEffect(() => {}, [canvasSize]);

	// useEffect(() => {
	// 	const connection = ZoomScaleUpdateEvent.Event.Connect((zoomScale: number) => {
	// 		const position = new Vector2(anchorPosition.X * zoomScale, anchorPosition.Y * zoomScale);
	// 		setDisplayPosition(position);
	// 		setZoomScale(GetZoomScale());
	// 	});

	// 	return () => {
	// 		connection.Disconnect();
	// 	};
	// }, [anchorPosition]);

	// const setPosition = (pos: Vector2) => {
	// 	setAnchorPosition(pos);

	// 	const position = new Vector2(pos.X * GetZoomScale(), pos.Y * GetZoomScale());
	// 	setDisplayPosition(position);
	// };

	return (
		<textbutton
			Position={UDim2.fromOffset(position.X, position.Y)}
			Size={UDim2.fromOffset(200 * zoomScale, 150 * zoomScale)}
			BackgroundColor3={Color3.fromHex("#FFFFFF")}
			Active={true}
			Text={""}
			AutoButtonColor={false}
		>
			<frame
				Size={new UDim2(1, 0, 0.1, 0)}
				Event={
					{
						// InputBegan: (element, inputObject) =>
						// 	SelectNodeTitleBar(element.Parent as Frame, inputObject, setPosition),
						// InputEnded: (_, inputObject) => DeselectNodeTitleBar(inputObject),
					}
				}
			/>
		</textbutton>
	);
}
