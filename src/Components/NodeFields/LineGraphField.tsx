import React, { useEffect, useRef } from "@rbxts/react";
import { LineGraphField as LineGraphFieldAPI } from "API/Fields/LineGraphField";
import { BasicTextLabel } from "Components/Basic/BasicTextLabel";
import Div from "Components/Div";
import { LoadGraph } from "Components/Windows/Line/LineGraph";
import { StyleColors } from "Style";
import { GetWindow, Windows } from "Windows/WindowSevice";
import { GetZoomScale } from "ZoomScale";

interface Props {
	Label: string;
	TextToInputRatio?: number;
	Graph: LineGraphFieldAPI;
	MaxValue?: number;
}

export function LineGraphField({ Label, TextToInputRatio = 0.5, Graph, MaxValue = 1 }: Props) {
	const windowRef = useRef<DockWidgetPluginGui>();

	const zoomScale = GetZoomScale();

	useEffect(() => {
		windowRef.current = GetWindow(Windows.ValueGraph)!;
	}, []);

	const OnMouseButton1Down = () => {
		LoadGraph(Graph, MaxValue);
		windowRef.current!.Enabled = !windowRef.current!.Enabled;
	};

	return (
		<Div Size={UDim2.fromScale(1, 0)} AutomaticSize="Y">
			<BasicTextLabel Size={new UDim2(TextToInputRatio, 0, 0, 20)} Text={Label} />
			<Div
				AnchorPoint={new Vector2(1, 0)}
				Position={UDim2.fromScale(1, 0)}
				Size={new UDim2(1 - TextToInputRatio, 0, 0, 20 * zoomScale)}
				BackgroundColor={StyleColors.Primary}
				onMouseButton1Down={OnMouseButton1Down}
			>
				<uipadding PaddingRight={new UDim(0, 4)} PaddingTop={new UDim(0, 4)} />

				<Div>
					<uistroke Thickness={4 * zoomScale} Color={StyleColors.Secondary} />
				</Div>
			</Div>
		</Div>
	);
}
