import Roact from "@rbxts/roact";
import { BasicTextLabel } from "Components/Basic/BasicTextLabel";
import { NumberInput } from "Components/Basic/NumeberInput";
import Div from "Components/Div";

interface Props {
	Size?: UDim2;

	Label: string;

	DefaultText: string;
	PlaceholderText?: string;

	TextToInputRatio?: number;
	AllowNegative?: boolean;

	NumberChanged: (number: number) => void;
}

export function NumberField({
	Size = UDim2.fromScale(1, 0),
	Label,
	DefaultText,
	PlaceholderText = "...",
	TextToInputRatio = 0.5,
	AllowNegative = false,
	NumberChanged,
}: Props) {
	return (
		<Div Size={Size} AutomaticSize="Y">
			<BasicTextLabel Size={new UDim2(TextToInputRatio, 0, 0, 20)} Text={Label} />
			<NumberInput
				AnchorPoint={new Vector2(1, 0)}
				Position={UDim2.fromScale(1, 0)}
				Size={new UDim2(1 - TextToInputRatio, 0, 0, 20)}
				PlaceholderText={PlaceholderText}
				Text={DefaultText}
				AllowNegative={AllowNegative}
				NumberChanged={NumberChanged}
			/>
		</Div>
	);
}
