import Roact, { useEffect, useRef } from "@rbxts/roact";
import { BasicTextLabel } from "Components/Basic/BasicTextLabel";
import Div from "Components/Div";
import { StyleColors } from "Style";
import { GetWindow, Windows } from "Windows/WindowSevice";

interface Props {
	Label: string;
	TextToInputRatio?: number;
}

export function ColorPickerField({ Label, TextToInputRatio = 0.5 }: Props) {
	const windowRef = useRef<DockWidgetPluginGui>();

	useEffect(() => {
		windowRef.current = GetWindow(Windows.ColorPicker)!;
	}, []);

	const OnMouseButton1Down = () => {
		windowRef.current!.Enabled = !windowRef.current!.Enabled;
	};

	return (
		<Div Size={UDim2.fromScale(1, 0)} AutomaticSize="Y">
			<BasicTextLabel Size={new UDim2(TextToInputRatio, 0, 0, 20)} Text={Label} />
			<Div
				AnchorPoint={new Vector2(1, 0)}
				Position={UDim2.fromScale(1, 0)}
				Size={new UDim2(1 - TextToInputRatio, 0, 0, 20)}
				BackgroundColor={StyleColors.Primary}
				onMouseButton1Down={OnMouseButton1Down}
			>
				<uipadding PaddingRight={new UDim(0, 4)} PaddingTop={new UDim(0, 4)} />

				<Div>
					<uistroke Thickness={4} Color={StyleColors.Secondary} />
				</Div>
			</Div>
		</Div>
	);
}
