import Roact from "@rbxts/roact";

interface Props {
	AnchorPoint?: Vector2;
	Position?: UDim2;
	Size?: UDim2;
	DisplayBackground?: boolean;
	Active?: boolean;
	onHover?: () => void;
	onUnhover?: () => void;
	onMouseButton1Down?: (element: GuiObject) => void;
	onMouseButton1Up?: (element: GuiObject) => void;
}

export function Div({
	AnchorPoint = new Vector2(0, 0),
	Position = new UDim2(0, 0, 0, 0),
	Size = UDim2.fromScale(1, 1),
	DisplayBackground = false,
	Active = false,
	onHover = undefined,
	onUnhover = undefined,
	onMouseButton1Down = undefined,
	onMouseButton1Up = undefined,
	children,
}: Roact.PropsWithChildren<Props>) {
	return (
		<frame
			AnchorPoint={AnchorPoint}
			Position={Position}
			Size={Size}
			BackgroundTransparency={DisplayBackground ? 0 : 1}
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
				InputBegan: (element, inputObject) => {
					if (inputObject.UserInputType === Enum.UserInputType.MouseButton1) {
						if (onMouseButton1Down !== undefined) {
							onMouseButton1Down(element);
						}
					}
				},
				InputEnded: (element, inputObject) => {
					if (inputObject.UserInputType === Enum.UserInputType.MouseButton1) {
						if (onMouseButton1Up !== undefined) {
							onMouseButton1Up(element);
						}
					}
				},
			}}
		>
			{children}
		</frame>
	);
}
