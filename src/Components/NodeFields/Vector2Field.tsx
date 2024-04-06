import Roact, { useRef } from "@rbxts/roact";
import { BasicTextLabel } from "Components/Basic/BasicTextLabel";
import Div from "Components/Div";
import { NumberField } from "./NumberField";

// TODO: add inputs (can't simply add cause API isn't individual binds);

interface Props {
	Label: string;
	ValueLabels?: [string, string];

	DefaultValues: { X: number; Y: number };
	TextToInputRatios?: [number, number];

	Vector2Changed: (x: number, y: number) => void;
}

export function Vector2Field({
	Label,
	ValueLabels = ["X", "Y"],
	DefaultValues,
	TextToInputRatios = [0.15, 0.15],
	Vector2Changed,
}: Props) {
	const xRef = useRef(DefaultValues.X);
	const yRef = useRef(DefaultValues.Y);

	const xChanged = (number: number) => {
		xRef.current = number;
		Vector2Changed(xRef.current, yRef.current);
	};

	const yChanged = (number: number) => {
		yRef.current = number;
		Vector2Changed(xRef.current, yRef.current);
	};

	return (
		<Div Size={UDim2.fromScale(1, 0)} AutomaticSize="Y">
			<uilistlayout FillDirection="Vertical" Padding={new UDim(0, 5)} />

			<BasicTextLabel Size={new UDim2(0.5, 0, 0, 20)} Text={Label} />
			<Div Size={UDim2.fromScale(1, 0)} AutomaticSize="Y">
				<uilistlayout FillDirection="Vertical" Padding={new UDim(0, 5)} />
				<uipadding PaddingLeft={new UDim(0, 10)} />

				<NumberField
					Label={ValueLabels[0]}
					DefaultText={tostring(DefaultValues.X)}
					AllowNegative={true}
					TextToInputRatio={TextToInputRatios[0]}
					NumberChanged={xChanged}
				/>
				<NumberField
					Label={ValueLabels[1]}
					DefaultText={tostring(DefaultValues.Y)}
					AllowNegative={true}
					TextToInputRatio={TextToInputRatios[0]}
					NumberChanged={yChanged}
				/>
			</Div>
		</Div>
	);
}
