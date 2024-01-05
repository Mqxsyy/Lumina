import Roact from "@rbxts/roact";
import { RunService } from "@rbxts/services";
import { GetMousePosition } from "WidgetHandler";

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

	RunService.BindToRenderStep("MoveNode", Enum.RenderPriority.Input.Value, () => MoveNode(element, inputObject));
}

function DeselectNodeTitleBar(element: Frame, inputObject: InputObject) {
	if (inputObject.UserInputType !== Enum.UserInputType.MouseButton1) return;
	RunService.UnbindFromRenderStep("MoveNode");
}

function MoveNode(element: Frame, inputObject: InputObject) {
	const mousePositionVec2 = GetMousePosition();
	const mousePosition = UDim2.fromOffset(mousePositionVec2.X, mousePositionVec2.Y);

	element.Position = mousePosition.sub(mouseOffset);
}

export function Node({ Position: Position }: NodeProps) {
	return (
		<textbutton
			AnchorPoint={new Vector2(0.5, 0.5)}
			Position={UDim2.fromOffset(Position.X, Position.Y)}
			Size={UDim2.fromOffset(200, 150)}
			BackgroundColor3={Color3.fromHex("#FFFFFF")}
			Active={true}
			Text={""}
			AutoButtonColor={false}
		>
			<frame
				Size={new UDim2(1, 0, 0, 20)}
				Event={{
					InputBegan: (element, inputObject) => SelectNodeTitleBar(element.Parent as Frame, inputObject),
					InputEnded: (element, inputObject) => DeselectNodeTitleBar(element.Parent as Frame, inputObject),
				}}
			/>
		</textbutton>
	);
}
