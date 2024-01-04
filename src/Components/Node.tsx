import Roact from "@rbxts/roact";

interface NodeProps {
	Position: Vector2;
}

export function Node({ Position: Position }: NodeProps) {
	return (
		<frame
			AnchorPoint={new Vector2(0.5, 0.5)}
			Position={UDim2.fromOffset(Position.X, Position.Y)}
			Size={UDim2.fromOffset(200, 150)}
			BackgroundColor3={Color3.fromHex("#FFFFFF")}
		/>
	);
}
