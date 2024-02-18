import Roact from "@rbxts/roact";

interface Props {
	AnchorPoint?: Vector2;
	Position?: UDim2;
	Size?: UDim2;
	displayBackground?: boolean;
	onHover?: () => void;
	onUnhover?: () => void;
}

export function Div({
	AnchorPoint = new Vector2(0, 0),
	Position = new UDim2(0, 0, 0, 0),
	Size = UDim2.fromScale(1, 1),
	displayBackground = false,
	onHover = undefined,
	onUnhover = undefined,
	children,
}: Roact.PropsWithChildren<Props>) {
	return (
		<frame
			AnchorPoint={AnchorPoint}
			Position={Position}
			Size={Size}
			BackgroundTransparency={displayBackground ? 0 : 1}
			BorderSizePixel={0}
			Event={{
				MouseEnter: () => {
					if (onHover !== undefined) {
						onHover();
					}
				},
				MouseLeave: () => {
					if (onUnhover !== undefined) {
						onUnhover();
					}
				},
			}}
		>
			{children}
		</frame>
	);
}
