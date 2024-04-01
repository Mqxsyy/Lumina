import Roact from "@rbxts/roact";
import { Event } from "API/Bindables/Event";
import { ParticlePlane as ParticlePlaneAPI } from "API/Nodes/Render/ParticlePlane";
import { BasicTextLabel } from "Components/Basic/BasicTextLabel";
import { AddNode, GetNextNodeId, NodeData } from "Services/NodesService";
import { GetMousePositionOnCanvas } from "Windows/MainWindow";
import { Node } from "../Node";

export function CreateParticlePlane() {
	return AddNode({
		data: {
			id: GetNextNodeId(),
			anchorPoint: GetMousePositionOnCanvas(),
			node: new ParticlePlaneAPI(),
			elementLoaded: new Event(),
		},
		create: (data: NodeData) => {
			return <ParticlePlane key={data.id} data={data} />;
		},
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
