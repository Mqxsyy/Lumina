import Roact from "@rbxts/roact";
import { ParticlePlane as ParticlePlaneAPI } from "API/Nodes/Render/ParticlePlane";
import { BasicTextLabel } from "Components/Basic/BasicTextLabel";
import { NumberField } from "Components/NodeFields/NumberField";
import { AddNode, GetNextNodeId, NodeData } from "Services/NodesService";
import { GetMousePositionOnCanvas } from "WidgetHandler";
import { Node } from "../Node";

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
	const transparencyChanged = (number: number) => {
		const transparencyField = (data.node as ParticlePlaneAPI).nodeFields.transparency;
		transparencyField.SetValue(number);
	};

	const emissionChanged = (number: number) => {
		const emissionField = (data.node as ParticlePlaneAPI).nodeFields.emission;
		emissionField.SetValue(number);
	};

	return (
		<Node Name="Particle Plane" Id={data.id} AnchorPoint={data.anchorPoint}>
			<uipadding PaddingLeft={new UDim(0, 10)} />

			<NumberField Label="Transparency" DefaultText="0" NumberChanged={transparencyChanged} />
			<NumberField Label="Emission" DefaultText="1" NumberChanged={emissionChanged} />

			<BasicTextLabel Size={new UDim2(1, 0, 0, 20)} Text={"Color - White"} />
			<BasicTextLabel Size={new UDim2(1, 0, 0, 20)} Text={"Orientation - Facing camera"} />
		</Node>
	);
}
