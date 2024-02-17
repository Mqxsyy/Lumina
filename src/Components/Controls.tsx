import Roact from "@rbxts/roact";
import { Div } from "./Div";
import { PrimaryButton } from "./PrimaryButton";

export function Controls() {
	return (
		<Div AnchorPoint={new Vector2(1, 0)} Position={new UDim2(1, -5, 0, 5)} Size={UDim2.fromOffset(100, 53)}>
			<PrimaryButton Size={UDim2.fromOffset(100, 25)} Text="Start" />
			<PrimaryButton Position={UDim2.fromOffset(0, 28)} Size={UDim2.fromOffset(100, 25)} Text="Stop" />
		</Div>
	);
}
