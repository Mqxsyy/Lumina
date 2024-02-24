import Roact from "@rbxts/roact";
import { Node } from "../Node";
import { TextInput } from "Components/Basic/TextInput";

export function CreateConstantSpawnNode(): Roact.Element {
	return <ConstantSpawn />;
}

export function ConstantSpawn() {
	return (
		<Node Name="Constant Spawn">
			<TextInput Size={new UDim2(1, 0, 0, 20)} PlaceholderText={"Enter Number"} />
		</Node>
	);
}
