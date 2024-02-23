import Roact from "@rbxts/roact";
import { Div } from "../Div";
import { ControlButton } from "./ControlButton";

const CANVAS_PADDING = 5;
const BUTTONS_PADDING = 5;
const BUTTON_WIDTH = 100;
const BUTTON_HEIGHT = 25;

export function Controls() {
	return (
		<Div
			AnchorPoint={new Vector2(1, 0)}
			Position={new UDim2(1, -CANVAS_PADDING, 0, CANVAS_PADDING)}
			Size={UDim2.fromOffset(BUTTON_WIDTH, BUTTON_HEIGHT * 2 + BUTTONS_PADDING)}
		>
			<ControlButton
				Position={UDim2.fromOffset(0, 0)}
				Size={UDim2.fromOffset(BUTTON_WIDTH, BUTTON_HEIGHT)}
				Text="Start"
			/>
			<ControlButton
				Position={UDim2.fromOffset(0, BUTTON_HEIGHT + BUTTONS_PADDING)}
				Size={UDim2.fromOffset(BUTTON_WIDTH, BUTTON_HEIGHT)}
				Text="Stop"
			/>
		</Div>
	);
}
