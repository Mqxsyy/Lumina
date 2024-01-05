import Roact, { useEffect, useRef } from "@rbxts/roact";
import { RunService } from "@rbxts/services";
import { ZoomScaleUpdateEvent } from "Events";
import { GetMousePosition } from "WidgetHandler";
import { GetZoomScale } from "ZoomScale";

interface NodeProps {
	Position: Vector2;
}

let mouseOffset = UDim2.fromOffset(0, 0);

function SelectNodeTitleBar(element: Frame, inputObject: InputObject) {
	if (inputObject.UserInputType !== Enum.UserInputType.MouseButton1) return;

	const mousePositionVec2 = GetMousePosition();
	const mousePosition = UDim2.fromOffset(mousePositionVec2.X, mousePositionVec2.Y);

	mouseOffset = mousePosition.sub(element.Position);

	// dumb? fix for element display order
	// yes zindex exists but it won't leave it above other elements
	const elementParent = element.Parent;
	element.Parent = undefined;
	element.Parent = elementParent;

	RunService.BindToRenderStep("MoveNode", Enum.RenderPriority.Input.Value, () => MoveNode(element));
}

function DeselectNodeTitleBar(inputObject: InputObject) {
	if (inputObject.UserInputType !== Enum.UserInputType.MouseButton1) return;
	RunService.UnbindFromRenderStep("MoveNode");
}

function MoveNode(element: Frame) {
	const mousePositionVec2 = GetMousePosition();
	const mousePosition = UDim2.fromOffset(mousePositionVec2.X, mousePositionVec2.Y);

	let newPosition = mousePosition.sub(mouseOffset);

	if (newPosition.Width.Offset < 0) newPosition = new UDim2(0, 0, 0, newPosition.Y.Offset);
	if (newPosition.Height.Offset < 0) newPosition = new UDim2(0, newPosition.X.Offset, 0, 0);

	element.Position = newPosition;
}

export function Node({ Position: Position }: NodeProps) {
	const frameRef = useRef(undefined as TextButton | undefined);

	useEffect(() => {
		ZoomScaleUpdateEvent.Event.Connect((zoomScale: number) => {
			frameRef.current!.Size = UDim2.fromOffset(200 * zoomScale, 150 * zoomScale);
			frameRef.current!.Position = UDim2.fromOffset(Position.X * zoomScale, Position.Y * zoomScale);
		});
	}, []);

	return (
		<textbutton
			Position={UDim2.fromOffset(Position.X * GetZoomScale(), Position.Y * GetZoomScale())}
			Size={UDim2.fromOffset(200 * GetZoomScale(), 150 * GetZoomScale())}
			BackgroundColor3={Color3.fromHex("#FFFFFF")}
			Active={true}
			Text={""}
			AutoButtonColor={false}
			ref={frameRef}
		>
			<frame
				Size={new UDim2(1, 0, 0.1, 0)}
				Event={{
					InputBegan: (element, inputObject) => SelectNodeTitleBar(element.Parent as Frame, inputObject),
					InputEnded: (_, inputObject) => DeselectNodeTitleBar(inputObject),
				}}
			/>
		</textbutton>
	);
}
