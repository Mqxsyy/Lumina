import Roact from "@rbxts/roact";
import { Node } from "../Node";
import { BasicTextLabel } from "Components/Basic/BasicTextLabel";
import { AddNode, GetNextNodeId, NodeData } from "Services/NodesService";
import { GetMousePositionOnCanvas } from "WidgetHandler";
import { ParticlePlane as ParticlePlaneAPI } from "API/Nodes/Render/ParticlePlane";

export function CreateParticlePlaneNode() {
	AddNode({
		data: {
			id: GetNextNodeId(),
			anchorPoint: GetMousePositionOnCanvas(),
			node: new ParticlePlaneAPI(),
		},
		create: (data: NodeData) => {
			return <ParticlePlane key={data.id} data={data} />;
		},
	});
}

function ParticlePlane({ data }: { data: NodeData }) {
	return (
		<Node Name="Particle Plane" Id={data.id} AnchorPoint={data.anchorPoint}>
			<BasicTextLabel Size={new UDim2(1, 0, 0, 20)} Text={"Transparency"} />
			<BasicTextLabel Size={new UDim2(1, 0, 0, 20)} Text={"Color"} />
			<BasicTextLabel Size={new UDim2(1, 0, 0, 20)} Text={"Emission"} />
			<BasicTextLabel Size={new UDim2(1, 0, 0, 20)} Text={"Orientation"} />
		</Node>
	);
}
