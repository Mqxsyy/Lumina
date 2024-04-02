import Roact, { useRef } from "@rbxts/roact";
import { BasicTextLabel } from "Components/Basic/BasicTextLabel";
import Div from "Components/Div";
import { NumberField } from "./NumberField";

// TODO: add inputs (can't simply add cause API isn't individual binds);

interface Props {
	Label: string;
	ValueLabels?: [string, string];

	DefaultValue: Vector2;
	TextToInputRatios?: [number, number];

	Vector2Changed: (vector2: Vector2) => void;
}

export function Vector2Field({
	Label,
	ValueLabels = ["X", "Y"],
	DefaultValue,
	TextToInputRatios = [0.15, 0.15],
	Vector2Changed,
}: Props) {
	const vector2Ref = useRef(DefaultValue);

	const xChanged = (number: number) => {
		const current = vector2Ref.current;
		vector2Ref.current = new Vector2(number, current.Y);
		Vector2Changed(vector2Ref.current);
	};

	const yChanged = (number: number) => {
		const current = vector2Ref.current;
		vector2Ref.current = new Vector2(current.X, number);
		Vector2Changed(vector2Ref.current);
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
					DefaultText={tostring(DefaultValue.X)}
					AllowNegative={true}
					TextToInputRatio={TextToInputRatios[0]}
					NumberChanged={xChanged}
				/>
				<NumberField
					Label={ValueLabels[1]}
					DefaultText={tostring(DefaultValue.Y)}
					AllowNegative={true}
					TextToInputRatio={TextToInputRatios[0]}
					NumberChanged={yChanged}
				/>
			</Div>
		</Div>
	);
}
