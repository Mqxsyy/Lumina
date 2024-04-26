import Roact from "@rbxts/roact";
import { CapitalizeFirstLetter } from "API/Lib";
import {
	AddRotationZRandom as AddRotationZRandomAPI,
	AddRotationZRandomFieldNames,
} from "API/Nodes/Update/AddRotationZRandom";
import { Vector2Field } from "Components/NodeFields/Vector2Field";
import { AddNode, NodeData } from "Services/NodesService";
import { Node } from "../Node";

export function CreateAddRotationZRandom() {
	return AddNode(new AddRotationZRandomAPI(), (data: NodeData) => {
		return <AddRotationZRandom key={`node_${data.node.id}`} data={data} />;
	});
}

function AddRotationZRandom({ data }: { data: NodeData }) {
	return (
		<Node Name="Add Rotation Z Random" Id={data.node.id} AnchorPoint={data.anchorPoint}>
			<Vector2Field
				NodeId={data.node.id}
				NodeField={(data.node as AddRotationZRandomAPI).nodeFields.range}
				NodeFieldName={AddRotationZRandomFieldNames.range}
				Label={CapitalizeFirstLetter(AddRotationZRandomFieldNames.range)}
				ValueLabels={["Min", "Max"]}
			/>
		</Node>
	);
}
