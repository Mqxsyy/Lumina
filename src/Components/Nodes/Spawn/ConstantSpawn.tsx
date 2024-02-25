import Roact from "@rbxts/roact";
import { Node } from "../Node";
import { BasicTextLabel } from "Components/Basic/BasicTextLabel";
import { TextInput } from "Components/Basic/TextInput";

export function CreateConstantSpawnNode(setRate: (rate: number) => void): Roact.Element {
	return <ConstantSpawn RateChanged={setRate} />;
}

interface Props {
	RateChanged?: (rate: number) => void;
}

function ConstantSpawn({ RateChanged }: Props) {
	const rateChanged = (text: string) => {
		if (RateChanged === undefined) return;

		const number = tonumber(text);

		if (number !== undefined) RateChanged(number);
		else RateChanged(0);
	};

	return (
		<Node Name="Constant Spawn">
			<BasicTextLabel Size={new UDim2(1, 0, 0, 20)} Text={"Rate"} />
			<TextInput Size={new UDim2(1, 0, 0, 20)} PlaceholderText={"Num"} Text="20" TextChanged={rateChanged} />
		</Node>
	);
}
