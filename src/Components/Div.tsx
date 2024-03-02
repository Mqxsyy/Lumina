import Roact, { useEffect } from "@rbxts/roact";

interface Props {
	AnchorPoint?: Vector2;
	Position?: UDim2;
	Size?: UDim2;
	AutomaticSize?: "X" | "Y" | "XY" | "None";
	BackgroundColor?: Color3 | undefined;
	// Active?: boolean;
	getFrame?: (frame: Frame) => void;
	onHover?: () => void;
	onUnhover?: () => void;
	onMouseButton1Down?: (element: GuiObject) => void;
	onMouseButton1Up?: (element: GuiObject) => void;
}

export function Div({
	AnchorPoint = new Vector2(0, 0),
	Position = new UDim2(0, 0, 0, 0),
	Size = UDim2.fromScale(1, 1),
	AutomaticSize = "None",
	BackgroundColor = undefined,
	// Active = false,
	onHover = undefined,
	onUnhover = undefined,
	onMouseButton1Down = undefined,
	onMouseButton1Up = undefined,
	getFrame = undefined,
	children,
}: Roact.PropsWithChildren<Props>) {
	const frameRef = Roact.createRef<Frame>();

	useEffect(() => {
		if (frameRef.current === undefined) return;
		if (getFrame === undefined) return;

		getFrame(frameRef.current);
	}, [frameRef.current]);

	return (
		<frame
			AnchorPoint={AnchorPoint}
			Position={Position}
			Size={Size}
			AutomaticSize={AutomaticSize}
			BackgroundColor3={BackgroundColor === undefined ? Color3.fromHex("#FFFFFF") : BackgroundColor}
			BackgroundTransparency={BackgroundColor === undefined ? 1 : 0}
			BorderSizePixel={0}
			ref={frameRef}
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
