import Roact, { useEffect, useRef } from "@rbxts/roact";
import Div from "Components/Div";
import { StyleColors } from "Style";
import { GetWindow, Windows } from "Windows/WindowSevice";

interface Props {
	AnchorPoint?: Vector2;
	Position?: UDim2;
	Size?: UDim2;
}

export default function LineGraph({
	AnchorPoint = Vector2.zero,
	Position = UDim2.fromScale(1, 1),
	Size = UDim2.fromScale(1, 1),
}: Props) {
	const windowRef = useRef<DockWidgetPluginGui>();

	useEffect(() => {
		windowRef.current = GetWindow(Windows.ValueGraph)!;
	}, []);

	const OnMouseButton1Down = () => {
		windowRef.current!.Enabled = !windowRef.current!.Enabled;
	};

	return (
		<Div
			AnchorPoint={AnchorPoint}
			Position={Position}
			Size={Size}
			BackgroundColor={StyleColors.Primary}
			onMouseButton1Down={OnMouseButton1Down}
		>
			<uistroke Thickness={2} Color={StyleColors.Secondary} />
		</Div>
	);
}
