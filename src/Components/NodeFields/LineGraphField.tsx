import Roact from "@rbxts/roact";
import { BasicTextLabel } from "Components/Basic/BasicTextLabel";
import Div from "Components/Div";
import LineGraph from "Components/Graphs/LineGraph";

interface Props {
	Size?: UDim2;

	Label: string;
	TextToInputRatio?: number;
}

export function LineGraphField({ Size = UDim2.fromScale(1, 0), Label, TextToInputRatio = 0.5 }: Props) {
	return (
		<Div Size={Size} AutomaticSize="Y">
			<BasicTextLabel Size={new UDim2(TextToInputRatio, 0, 0, 20)} Text={Label} />
			<LineGraph
				AnchorPoint={new Vector2(1, 0)}
				Position={UDim2.fromScale(1, 0)}
				Size={new UDim2(1 - TextToInputRatio, 0, 0, 20)}
			/>
		</Div>
	);
}
