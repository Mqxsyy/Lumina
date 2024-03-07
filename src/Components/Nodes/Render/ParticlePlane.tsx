import Roact from "@rbxts/roact";
import { Node } from "../Node";
import { BasicTextLabel } from "Components/Basic/BasicTextLabel";
import { AddNode, GetNextNodeId, NodeData } from "Services/NodesService";
import { GetMousePositionOnCanvas } from "WidgetHandler";
import { ParticlePlane as ParticlePlaneAPI } from "API/Nodes/Render/ParticlePlane";
import { Div } from "Components/Div";
import { NumberInput } from "Components/Basic/NumeberInput";

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

			<Div Size={UDim2.fromScale(1, 0)} AutomaticSize="Y">
				<BasicTextLabel Size={new UDim2(0.25, 0, 0, 20)} Text={"Transparency"} />
				<NumberInput
					AnchorPoint={new Vector2(1, 0)}
					Position={UDim2.fromScale(1, 0)}
					Size={new UDim2(0.5, 0, 0, 20)}
					PlaceholderText={"..."}
					Text="0"
					NumberChanged={transparencyChanged}
				/>
			</Div>
			<Div Size={UDim2.fromScale(1, 0)} AutomaticSize="Y">
				<BasicTextLabel Size={new UDim2(0.25, 0, 0, 20)} Text={"Emission"} />
				<NumberInput
					AnchorPoint={new Vector2(1, 0)}
					Position={UDim2.fromScale(1, 0)}
					Size={new UDim2(0.5, 0, 0, 20)}
					PlaceholderText={"..."}
					Text="1"
					NumberChanged={emissionChanged}
				/>
			</Div>

			<BasicTextLabel Size={new UDim2(1, 0, 0, 20)} Text={"Color - White"} />
			<BasicTextLabel Size={new UDim2(1, 0, 0, 20)} Text={"Orientation - Facing camera"} />
		</Node>
	);
}
