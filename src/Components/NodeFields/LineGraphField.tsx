import Roact, { useEffect, useRef } from "@rbxts/roact";
import { LineGraphField as LineGraphFieldAPI } from "API/Fields/LineGraphField";
import { BasicTextLabel } from "Components/Basic/BasicTextLabel";
import Div from "Components/Div";
import { LoadGraph } from "Components/Graphs/Line/LineGraph";
import { StyleColors } from "Style";
import { GetWindow, Windows } from "Windows/WindowSevice";

interface Props {
	Size?: UDim2;
	Label: string;
	TextToInputRatio?: number;
	Graph: LineGraphFieldAPI;
}

export function LineGraphField({ Size = UDim2.fromScale(1, 0), Label, TextToInputRatio = 0.5, Graph }: Props) {
	const windowRef = useRef<DockWidgetPluginGui>();

	useEffect(() => {
		windowRef.current = GetWindow(Windows.ValueGraph)!;
	}, []);

	const OnMouseButton1Down = () => {
		LoadGraph(Graph);
		windowRef.current!.Enabled = !windowRef.current!.Enabled;
	};

	return (
		<Div Size={Size} AutomaticSize="Y">
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
