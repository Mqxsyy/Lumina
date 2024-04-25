import Roact from "@rbxts/roact";
import { SimpleVector3, Vector3Field as Vector3FieldAPI } from "API/Fields/Vector3Field";
import { BasicTextLabel } from "Components/Basic/BasicTextLabel";
import ConnectionPointIn from "Components/Connections/ConnectionPointIn";
import Div from "Components/Div";
import { NumberField } from "./NumberField";

interface Props {
	NodeId: number;
	NodeField: Vector3FieldAPI;
	NodeFieldName: string;
	Label: string;
	DefaultValue: SimpleVector3;
	PlaceholderValues?: [string, string, string];
}

// maybe don't receive nodeField but instead just receive functions like all other fields

export function Vector3Field({
	NodeId,
	NodeField,
	NodeFieldName,
	Label,
	DefaultValue,
	PlaceholderValues = ["...", "...", "..."],
}: Props) {
	return (
		<Div Size={UDim2.fromScale(1, 0)} AutomaticSize="Y">
			<uilistlayout FillDirection="Vertical" Padding={new UDim(0, 5)} />

			<BasicTextLabel Size={new UDim2(0.5, 0, 0, 20)} Text={Label} />
			<Div Size={UDim2.fromScale(1, 0)} AutomaticSize="Y">
				<uilistlayout FillDirection="Vertical" Padding={new UDim(0, 5)} />

				<Div Size={UDim2.fromScale(1, 0)} AutomaticSize="Y">
					<uilistlayout FillDirection="Horizontal" Padding={new UDim(0, 5)} />

					<ConnectionPointIn
						Size={UDim2.fromOffset(20, 20)}
						NodeId={NodeId}
						NodeFieldName={NodeFieldName}
						BindFunction={NodeField.BindX}
						UnbindFunction={NodeField.UnbindX}
					/>
					<NumberField
						Size={new UDim2(1, -25, 0, 0)}
						Label={"X"}
						DefaultText={tostring(DefaultValue.x)}
						PlaceholderText={PlaceholderValues[0]}
						AllowNegative={true}
						TextToInputRatio={0.25}
						NumberChanged={NodeField.SetX}
					/>
				</Div>
				<Div Size={UDim2.fromScale(1, 0)} AutomaticSize="Y">
					<uilistlayout FillDirection="Horizontal" Padding={new UDim(0, 5)} />

					<ConnectionPointIn
						Size={UDim2.fromOffset(20, 20)}
						NodeId={NodeId}
						NodeFieldName={NodeFieldName}
						BindFunction={NodeField.BindY}
						UnbindFunction={NodeField.UnbindY}
					/>
					<NumberField
						Size={new UDim2(1, -25, 0, 0)}
						Label={"Y"}
						DefaultText={tostring(DefaultValue.y)}
						PlaceholderText={PlaceholderValues[1]}
						AllowNegative={true}
						TextToInputRatio={0.25}
						NumberChanged={NodeField.SetY}
					/>
				</Div>
				<Div Size={UDim2.fromScale(1, 0)} AutomaticSize="Y">
					<uilistlayout FillDirection="Horizontal" Padding={new UDim(0, 5)} />

					<ConnectionPointIn
						Size={UDim2.fromOffset(20, 20)}
						NodeId={NodeId}
						NodeFieldName={NodeFieldName}
						BindFunction={NodeField.BindY}
						UnbindFunction={NodeField.UnbindY}
					/>
					<NumberField
						Size={new UDim2(1, -25, 0, 0)}
						Label={"Z"}
						DefaultText={tostring(DefaultValue.z)}
						PlaceholderText={PlaceholderValues[2]}
						AllowNegative={true}
						TextToInputRatio={0.25}
						NumberChanged={NodeField.SetZ}
					/>
				</Div>
			</Div>
		</Div>
	);
}
