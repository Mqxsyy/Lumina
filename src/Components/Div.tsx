import Roact from "@rbxts/roact";

interface Props {
	AnchorPoint?: Vector2;
	Position?: UDim2;
	Size?: UDim2;
}

export function Div({
	AnchorPoint = new Vector2(0, 0),
	Position = new UDim2(0, 0, 0, 0),
	Size = UDim2.fromScale(1, 1),
	children,
}: Roact.PropsWithChildren<Props>) {
	return (
		<frame AnchorPoint={AnchorPoint} Position={Position} Size={Size} BackgroundTransparency={1} BorderSizePixel={0}>
			{children}
		</frame>
	);
}
