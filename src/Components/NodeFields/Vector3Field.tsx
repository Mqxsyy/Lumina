import Roact, { useRef } from "@rbxts/roact";
import { BasicTextLabel } from "Components/Basic/BasicTextLabel";
import { Div } from "Components/Div";
import { NumberField } from "./NumberField";
import ConnectionPointIn from "Components/Connections/ConnectionPointIn";
import { NodeData } from "Services/NodesService";
import { Vector3Field as Vector3FieldAPI } from "API/Fields/Vector3Field";

interface Props {
	NodeData: NodeData;
	Label: string;
	DefaultValue: Vector3;
	PlaceholderValues?: [string, string, string];
}

export function Vector3Field({ NodeData, Label, DefaultValue, PlaceholderValues = ["...", "...", "..."] }: Props) {
	const nodeRef = useRef(NodeData.node.nodeFields.position as Vector3FieldAPI);

	return (
		<Div Size={UDim2.fromScale(1, 0)} AutomaticSize="Y">
			<uilistlayout FillDirection="Vertical" Padding={new UDim(0, 5)} />

			<BasicTextLabel Size={new UDim2(0.5, 0, 0, 20)} Text={Label} />
			<Div Size={UDim2.fromScale(1, 0)} AutomaticSize="Y">
				<uilistlayout FillDirection="Vertical" Padding={new UDim(0, 5)} />

				<Div Size={UDim2.fromScale(1, 0)} AutomaticSize="Y">
					<uilistlayout FillDirection="Horizontal" Padding={new UDim(0, 5)} />

					<ConnectionPointIn Size={UDim2.fromOffset(20, 20)} BindFunction={nodeRef.current.BindValueX} />
					<NumberField
						Size={new UDim2(1, -25, 0, 0)}
						Label={"X"}
						DefaultText={tostring(DefaultValue.X)}
						PlaceholderText={PlaceholderValues[0]}
						AllowNegative={true}
						TextToInputRatio={0.25}
						NumberChanged={nodeRef.current.SetValueX}
					/>
				</Div>
				<Div Size={UDim2.fromScale(1, 0)} AutomaticSize="Y">
					<uilistlayout FillDirection="Horizontal" Padding={new UDim(0, 5)} />

					<ConnectionPointIn Size={UDim2.fromOffset(20, 20)} BindFunction={nodeRef.current.BindValueY} />
					<NumberField
						Size={new UDim2(1, -25, 0, 0)}
						Label={"Y"}
						DefaultText={tostring(DefaultValue.Y)}
						PlaceholderText={PlaceholderValues[1]}
						AllowNegative={true}
						TextToInputRatio={0.25}
						NumberChanged={nodeRef.current.SetValueY}
					/>
				</Div>
				<Div Size={UDim2.fromScale(1, 0)} AutomaticSize="Y">
					<uilistlayout FillDirection="Horizontal" Padding={new UDim(0, 5)} />

					<ConnectionPointIn Size={UDim2.fromOffset(20, 20)} BindFunction={nodeRef.current.BindValueZ} />
					<NumberField
						Size={new UDim2(1, -25, 0, 0)}
						Label={"Z"}
						DefaultText={tostring(DefaultValue.Z)}
						PlaceholderText={PlaceholderValues[2]}
						AllowNegative={true}
						TextToInputRatio={0.25}
						NumberChanged={nodeRef.current.SetValueZ}
					/>
				</Div>
			</Div>
		</Div>
	);
}
