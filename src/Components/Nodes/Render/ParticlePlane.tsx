import Roact from "@rbxts/roact";
import { ParticlePlane as ParticlePlaneAPI } from "API/Nodes/Render/ParticlePlane";
import { BasicTextLabel } from "Components/Basic/BasicTextLabel";
import { AddNode, NodeData } from "Services/NodesService";
import { Node } from "../Node";

export function CreateParticlePlane() {
	return AddNode(new ParticlePlaneAPI(), (data: NodeData) => {
		return <ParticlePlane key={`node_${data.node.id}`} data={data} />;
	});
}

function ParticlePlane({ data }: { data: NodeData }) {
	return (
		<Node Name="Particle Plane" Id={data.node.id} AnchorPoint={data.anchorPoint}>
			<BasicTextLabel Size={new UDim2(1, 0, 0, 20)} Text={"Orientation - Facing camera"} />
		</Node>
	);
}
