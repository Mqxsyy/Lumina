import Roact from "@rbxts/roact";
import { Node } from "../Node";
import { BasicTextLabel } from "Components/Basic/BasicTextLabel";

export function CreateStaticForceNode(): Roact.Element {
	return <StaticForce />;
}

function StaticForce() {
	return (
		<Node Name="Static Force">
			<BasicTextLabel Size={new UDim2(1, 0, 0, 20)} Text={"Position"} />
			<BasicTextLabel Size={new UDim2(1, 0, 0, 20)} Text={"IsLocal"} />
			<BasicTextLabel Size={new UDim2(1, 0, 0, 20)} Text={"StoreValue"} />
		</Node>
	);
}
