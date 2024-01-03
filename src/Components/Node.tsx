import Roact from "@rbxts/roact";

export function Node() {
	return (
		<frame
			AnchorPoint={new Vector2(0.5, 0.5)}
			Position={UDim2.fromScale(0.5, 0.5)}
			Size={UDim2.fromScale(0.2, 0.2)}
			BackgroundColor3={Color3.fromHex("#FFFFFF")}
		/>
	);
}
