import Roact from "@rbxts/roact";
import { PlacedNodes } from "Nodes";

export function App() {
	return (
		<frame Size={UDim2.fromScale(1, 1)} BackgroundColor3={Color3.fromHex("#1B1B1B")}>
			{...PlacedNodes}
		</frame>
	);
}
