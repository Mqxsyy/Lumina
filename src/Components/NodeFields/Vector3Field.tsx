import Roact from "@rbxts/roact";
import { Vector3Field as Vector3FieldAPI } from "API/Fields/Vector3Field";
import { BasicTextLabel } from "Components/Basic/BasicTextLabel";
import ConnectionPointIn from "Components/Connections/ConnectionPointIn";
import Div from "Components/Div";
import { NumberField } from "./NumberField";

interface Props {
	NodeId: number;
	NodeAnchorPoint: Vector2;
	NodeField: Vector3FieldAPI;
	NodeFieldName: string;
	Label: string;
	DefaultValue: Vector3;
	PlaceholderValues?: [string, string, string];
}

// maybe don't receive nodeField but instead just receive functions like all other fields

export function Vector3Field({
	NodeId,
	NodeAnchorPoint,
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
						NodeAbsolutePosition={NodeAnchorPoint}
						BindFunction={NodeField.BindX}
						UnbindFunction={NodeField.UnbindX}
					/>
					<NumberField
						Size={new UDim2(1, -25, 0, 0)}
						Label={"X"}
						DefaultText={tostring(DefaultValue.X)}
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
						NodeAbsolutePosition={NodeAnchorPoint}
						BindFunction={NodeField.BindY}
						UnbindFunction={NodeField.UnbindY}
					/>
					<NumberField
						Size={new UDim2(1, -25, 0, 0)}
						Label={"Y"}
						DefaultText={tostring(DefaultValue.Y)}
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
						NodeAbsolutePosition={NodeAnchorPoint}
						BindFunction={NodeField.BindY}
						UnbindFunction={NodeField.UnbindY}
					/>
					<NumberField
						Size={new UDim2(1, -25, 0, 0)}
						Label={"Z"}
						DefaultText={tostring(DefaultValue.Z)}
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
