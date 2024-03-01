import Roact from "@rbxts/roact";
import { Node } from "../Node";
import { BasicTextLabel } from "Components/Basic/BasicTextLabel";
import { NumberInput } from "Components/Basic/NumeberInput";
import { Div } from "Components/Div";

export function CreateConstantSpawnNode(setRate: (rate: number) => void): Roact.Element {
	return <ConstantSpawn RateChanged={setRate} />;
}

interface Props {
	RateChanged?: (rate: number) => void;
}

function ConstantSpawn({ RateChanged }: Props) {
	const rateChanged = (number: number) => {
		if (RateChanged === undefined) return;

		if (number > 1000) {
			RateChanged(1000);
			return;
		}

		RateChanged(number);
		return;
	};

	return (
		<Node Name="Constant Spawn">
			<uipadding PaddingLeft={new UDim(0, 10)} />

			<Div Size={new UDim2(1, 0, 0, 20)}>
				<BasicTextLabel Size={new UDim2(0.25, 0, 0, 20)} Text={"Rate"} />
				<NumberInput
					Position={UDim2.fromScale(0.25, 0)}
					Size={new UDim2(0.75, 0, 0, 20)}
					PlaceholderText={"Num"}
					Text="20"
					NumberChanged={rateChanged}
				/>
			</Div>
		</Node>
	);
}
