import Roact from "@rbxts/roact";
import { CreateNode, PlacedNodes } from "Nodes";
import { GetMousePosition } from "WidgetHandler";

function OnInput(inputObject: InputObject) {
	if (inputObject.UserInputType === Enum.UserInputType.MouseButton1) {
		CreateNode(GetMousePosition());
	}
}

export function App() {
	return (
		<frame
			Size={UDim2.fromScale(1, 1)}
			BackgroundColor3={Color3.fromHex("#1B1B1B")}
			Event={{
				InputBegan: (element, inputObject: InputObject) => {
					OnInput(inputObject);
				},
			}}
		>
			{...PlacedNodes}
		</frame>
	);
}
