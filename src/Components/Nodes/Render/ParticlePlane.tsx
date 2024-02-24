import Roact from "@rbxts/roact";
import { Node } from "../Node";
import { BasicTextLabel } from "Components/Basic/BasicTextLabel";

export function CreateParticlePlaneNode(): Roact.Element {
	return <ParticlePlane />;
}

function ParticlePlane() {
	return (
		<Node Name="Particle Plane">
			<BasicTextLabel Size={new UDim2(1, 0, 0, 20)} Text={"Transparency"} />
			<BasicTextLabel Size={new UDim2(1, 0, 0, 20)} Text={"Color"} />
			<BasicTextLabel Size={new UDim2(1, 0, 0, 20)} Text={"Emission"} />
			<BasicTextLabel Size={new UDim2(1, 0, 0, 20)} Text={"Orientation"} />
		</Node>
	);
}
