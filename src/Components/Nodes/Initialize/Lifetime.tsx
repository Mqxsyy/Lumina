import Roact from "@rbxts/roact";
import { Node } from "../Node";
import { BasicTextLabel } from "Components/Basic/BasicTextLabel";

export function CreateLifetimeNode(): Roact.Element {
	return <Lifetime />;
}

function Lifetime() {
	return (
		<Node Name="Lifetime">
			<BasicTextLabel Size={new UDim2(1, 0, 0, 20)} Text={"Time"} />
		</Node>
	);
}
