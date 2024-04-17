import Roact from "@rbxts/roact";
import { ParticlePlane as ParticlePlaneAPI } from "API/Nodes/Render/ParticlePlane";
import { BasicTextLabel } from "Components/Basic/BasicTextLabel";
import { AddNode, NodeData } from "Services/NodesService";
import { Node } from "../Node";

export function CreateParticlePlane() {
	return AddNode(new ParticlePlaneAPI(), (data: NodeData) => {
		return <ParticlePlane data={data} />;
	});
}

function ParticlePlane({ data }: { data: NodeData }) {
	return (
		<Node Name="Particle Plane" Id={data.id} AnchorPoint={data.anchorPoint}>
			<uipadding PaddingLeft={new UDim(0, 10)} />
			<BasicTextLabel Size={new UDim2(1, 0, 0, 20)} Text={"Orientation - Facing camera"} />
		</Node>
	);
}
