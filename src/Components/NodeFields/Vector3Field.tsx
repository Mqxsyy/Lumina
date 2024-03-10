import Roact, { useRef } from "@rbxts/roact";
import { BasicTextLabel } from "Components/Basic/BasicTextLabel";
import { Div } from "Components/Div";
import { NumberField } from "./NumberField";
import ConnectionPointIn from "Components/Connections/ConnectionPointIn";

interface Props {
	Label: string;

	DefaultValue: Vector3;
	PlaceholderValues?: [string, string, string];

	Vector3Changed: (vector3: Vector3) => void;
}

export function Vector3Field({
	Label,
	DefaultValue,
	PlaceholderValues = ["...", "...", "..."],
	Vector3Changed,
}: Props) {
	const vector3Ref = useRef(DefaultValue);

	const xChanged = (number: number) => {
		const current = vector3Ref.current;
		vector3Ref.current = new Vector3(number, current.Y, current.Z);
		Vector3Changed(vector3Ref.current);
	};

	const yChanged = (number: number) => {
		const current = vector3Ref.current;
		vector3Ref.current = new Vector3(current.X, number, current.Z);
		Vector3Changed(vector3Ref.current);
	};

	const zChanged = (number: number) => {
		const current = vector3Ref.current;
		vector3Ref.current = new Vector3(current.X, current.Y, number);
		Vector3Changed(vector3Ref.current);
	};

	return (
		<Div Size={UDim2.fromScale(1, 0)} AutomaticSize="Y">
			<uilistlayout FillDirection="Vertical" Padding={new UDim(0, 5)} />

			<BasicTextLabel Size={new UDim2(0.5, 0, 0, 20)} Text={Label} />
			<Div Size={UDim2.fromScale(1, 0)} AutomaticSize="Y">
				<uilistlayout FillDirection="Vertical" Padding={new UDim(0, 5)} />

				<Div Size={UDim2.fromScale(1, 0)} AutomaticSize="Y">
					<uilistlayout FillDirection="Horizontal" Padding={new UDim(0, 5)} />

					<ConnectionPointIn Size={UDim2.fromOffset(20, 20)} />
					<NumberField
						Size={new UDim2(1, -25, 0, 0)}
						Label={"X"}
						DefaultText={tostring(DefaultValue.X)}
						PlaceholderText={PlaceholderValues[0]}
						AllowNegative={true}
						TextToInputRatio={0.25}
						NumberChanged={xChanged}
					/>
				</Div>
				<Div Size={UDim2.fromScale(1, 0)} AutomaticSize="Y">
					<uilistlayout FillDirection="Horizontal" Padding={new UDim(0, 5)} />

					<ConnectionPointIn Size={UDim2.fromOffset(20, 20)} />
					<NumberField
						Size={new UDim2(1, -25, 0, 0)}
						Label={"Y"}
						DefaultText={tostring(DefaultValue.Y)}
						PlaceholderText={PlaceholderValues[1]}
						AllowNegative={true}
						TextToInputRatio={0.25}
						NumberChanged={yChanged}
					/>
				</Div>
				<Div Size={UDim2.fromScale(1, 0)} AutomaticSize="Y">
					<uilistlayout FillDirection="Horizontal" Padding={new UDim(0, 5)} />

					<ConnectionPointIn Size={UDim2.fromOffset(20, 20)} />
					<NumberField
						Size={new UDim2(1, -25, 0, 0)}
						Label={"Z"}
						DefaultText={tostring(DefaultValue.Z)}
						PlaceholderText={PlaceholderValues[2]}
						AllowNegative={true}
						TextToInputRatio={0.25}
						NumberChanged={zChanged}
					/>
				</Div>
			</Div>
		</Div>
	);
}
