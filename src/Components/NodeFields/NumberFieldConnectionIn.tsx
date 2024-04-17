import Roact from "@rbxts/roact";
import ConnectionPointIn from "Components/Connections/ConnectionPointIn";
import { NumberField } from "./NumberField";
import Div from "Components/Div";

interface Props {
	NodeId: number;
	NodeFieldName: string;
	NodeAbsolutePosition: Vector2;
	DefaultText: string;
	TextToInputRatio?: number;
	InputDisabled: boolean;
	NumberChanged: (newValue: number) => void;
	BindFunction: (newValue: () => number, boundNodeId: number) => void;
	UnbindFunction: () => void;
}

export default function NumberFieldConnectionIn({
	NodeId,
	NodeFieldName,
	NodeAbsolutePosition,
	DefaultText,
	TextToInputRatio = 0.25,
	InputDisabled,
	NumberChanged,
	BindFunction,
	UnbindFunction,
}: Props) {
	return (
		<Div Size={UDim2.fromScale(1, 0)} AutomaticSize="Y">
			<uilistlayout FillDirection="Horizontal" Padding={new UDim(0, 5)} />

			<ConnectionPointIn
				Size={UDim2.fromOffset(20, 20)}
				NodeId={NodeId}
				NodeFieldName={NodeFieldName}
				NodeAbsolutePosition={NodeAbsolutePosition}
				BindFunction={BindFunction}
				UnbindFunction={UnbindFunction}
			/>
			<NumberField
				Size={new UDim2(1, -25, 0, 0)}
				Label={NodeFieldName}
				DefaultText={DefaultText}
				TextToInputRatio={TextToInputRatio}
				Disabled={InputDisabled}
				NumberChanged={NumberChanged}
			/>
		</Div>
	);
}
