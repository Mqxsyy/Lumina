import Roact from "@rbxts/roact";
import { Node } from "../Node";
import { BasicTextLabel } from "Components/Basic/BasicTextLabel";
import { Div } from "Components/Div";
import { NumberInput } from "Components/Basic/NumeberInput";

export function CreatePositionNode(
	setX: (x: number) => void,
	setY: (y: number) => void,
	setZ: (z: number) => void,
): Roact.Element {
	return <Position SetX={setX} SetY={setY} SetZ={setZ} />;
}

interface Props {
	SetX?: (x: number) => void;
	SetY?: (y: number) => void;
	SetZ?: (z: number) => void;
}

function Position({ SetX, SetY, SetZ }: Props) {
	const xChanged = (number: number) => {
		if (SetX === undefined) return;
		SetX(number);
	};

	const yChanged = (number: number) => {
		if (SetY === undefined) return;
		SetY(number);
	};

	const zChanged = (number: number) => {
		if (SetZ === undefined) return;
		SetZ(number);
	};

	return (
		<Node Name="Position">
			<uipadding PaddingLeft={new UDim(0, 10)} />
			<uilistlayout FillDirection="Vertical" Padding={new UDim(0, 5)} />

			<Div Size={new UDim2(1, 0, 0, 20)}>
				<BasicTextLabel Size={new UDim2(0.25, 0, 0, 20)} Text={"X"} />
				<NumberInput
					Position={UDim2.fromScale(0.25, 0)}
					Size={new UDim2(0.75, 0, 0, 20)}
					PlaceholderText={"..."}
					Text="0"
					AllowNegative={true}
					NumberChanged={xChanged}
				/>
			</Div>

			<Div Size={new UDim2(1, 0, 0, 20)}>
				<BasicTextLabel Size={new UDim2(0.25, 0, 0, 20)} Text={"Y"} />
				<NumberInput
					Position={UDim2.fromScale(0.25, 0)}
					Size={new UDim2(0.75, 0, 0, 20)}
					PlaceholderText={"..."}
					Text="0"
					AllowNegative={true}
					NumberChanged={yChanged}
				/>
			</Div>

			<Div Size={new UDim2(1, 0, 0, 20)}>
				<BasicTextLabel Size={new UDim2(0.25, 0, 0, 20)} Text={"Z"} />
				<NumberInput
					Position={UDim2.fromScale(0.25, 0)}
					Size={new UDim2(0.75, 0, 0, 20)}
					PlaceholderText={"..."}
					Text="0"
					AllowNegative={true}
					NumberChanged={zChanged}
				/>
			</Div>
		</Node>
	);
}
