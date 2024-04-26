import Roact from "@rbxts/roact";
import { NumberField as NumberFieldAPI } from "API/Fields/NumberField";
import { BasicTextLabel } from "Components/Basic/BasicTextLabel";
import { NumberInput } from "Components/Basic/NumberInput";
import ConnectionPointIn from "Components/Connections/ConnectionPointIn";
import Div from "Components/Div";

interface Props {
	NodeId: number;
	NodeField: NumberFieldAPI;
	NodeFieldName: string;

	Label: string;
	TextToInputRatio?: number;
	AllowNegative?: boolean;

	AllowConnection?: boolean;
	OverrideSetNumber?: (number: number) => void;
}

export default function NumberField({
	NodeId,
	NodeField,
	NodeFieldName,
	Label,
	TextToInputRatio = 0.5,
	AllowNegative = false,
	AllowConnection = true,
	OverrideSetNumber = undefined,
}: Props) {
	return (
		<Div Size={UDim2.fromScale(1, 0)} AutomaticSize="Y">
			<uilistlayout FillDirection="Horizontal" VerticalAlignment={"Center"} Padding={new UDim(0, 5)} />

			{AllowConnection && (
				<ConnectionPointIn
					NodeId={NodeId}
					NodeFieldName={NodeFieldName}
					BindFunction={NodeField.BindNumber}
					UnbindFunction={NodeField.UnbindNumber}
				/>
			)}
			<Div Size={new UDim2(1, AllowConnection ? -19 : 0, 0, 0)} AutomaticSize="Y">
				<BasicTextLabel Size={new UDim2(TextToInputRatio, 0, 0, 20)} Text={Label} TextYAlignment="Bottom" />
				<NumberInput
					AnchorPoint={new Vector2(1, 0)}
					Position={UDim2.fromScale(1, 0)}
					Size={new UDim2(1 - TextToInputRatio, 0, 0, 20)}
					Text={() => tostring(NodeField.GetNumber())}
					AllowNegative={AllowNegative}
					Disabled={NodeField.boundNode !== undefined}
					NumberChanged={OverrideSetNumber || NodeField.SetNumber}
				/>
			</Div>
		</Div>
	);
}
