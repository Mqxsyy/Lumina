import Roact from "@rbxts/roact";
import { Node } from "../Node";
import { BasicTextLabel } from "Components/Basic/BasicTextLabel";

export function CreateConstantSpawnNode(): Roact.Element {
	return <ConstantSpawn />;
}

function ConstantSpawn() {
	return (
		<Node Name="Constant Spawn">
			<BasicTextLabel Size={new UDim2(1, 0, 0, 20)} Text={"Rate"} />
		</Node>
	);
}
