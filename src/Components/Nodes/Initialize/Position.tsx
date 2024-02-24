import Roact from "@rbxts/roact";
import { Node } from "../Node";
import { BasicTextLabel } from "Components/Basic/BasicTextLabel";

export function CreatePositionNode(): Roact.Element {
	return <Position />;
}

function Position() {
	return (
		<Node Name="Position">
			<BasicTextLabel Size={new UDim2(1, 0, 0, 20)} Text={"Vec3"} />
		</Node>
	);
}
