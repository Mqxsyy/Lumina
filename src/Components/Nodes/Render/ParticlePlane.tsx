import Roact from "@rbxts/roact";
import { ParticlePlane as ParticlePlaneAPI } from "API/Nodes/Render/ParticlePlane";
import { BasicTextLabel } from "Components/Basic/BasicTextLabel";
import { NumberField } from "Components/NodeFields/NumberField";
import { AddNode, GetNextNodeId, NodeData } from "Services/NodesService";
import { GetMousePositionOnCanvas } from "Windows/MainWindow";
import { Node } from "../Node";
import { Event } from "API/Bindables/Event";
import { ColorPickerField } from "Components/NodeFields/ColorPicker";

export function CreateParticlePlaneNode() {
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
	const emissionChanged = (number: number) => {
		const emissionField = (data.node as ParticlePlaneAPI).nodeFields.emission;
		emissionField.SetValue(number);
	};

	return (
		<Node Name="Particle Plane" Id={data.id} AnchorPoint={data.anchorPoint}>
			<uipadding PaddingLeft={new UDim(0, 10)} />

			<NumberField Label="Emission" DefaultText="1" NumberChanged={emissionChanged} />
			<ColorPickerField Label="Color" />
			<BasicTextLabel Size={new UDim2(1, 0, 0, 20)} Text={"Orientation - Facing camera"} />
		</Node>
	);
}
