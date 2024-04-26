import Roact from "@rbxts/roact";
import {
	SetRotationZRandom as SetRotationZRandomAPI,
	SetRotationZRandomFieldNames,
} from "API/Nodes/Initialize/SetRotationZRandom";
import { Vector2Field } from "Components/NodeFields/Vector2Field";
import { AddNode, NodeData } from "Services/NodesService";
import { Node } from "../Node";
import { CapitalizeFirstLetter } from "API/Lib";

export function CreateRotationZRandom() {
	return AddNode(new SetRotationZRandomAPI(), (data: NodeData) => {
		return <SetRotationZRandom key={`node_${data.node.id}`} data={data} />;
	});
}

function SetRotationZRandom({ data }: { data: NodeData }) {
	return (
		<Node Name="Set Rotation Z Random" Id={data.node.id} AnchorPoint={data.anchorPoint}>
			<Vector2Field
				NodeId={data.node.id}
				NodeField={(data.node as SetRotationZRandomAPI).nodeFields.range}
				NodeFieldName={SetRotationZRandomFieldNames.range}
				Label={CapitalizeFirstLetter(SetRotationZRandomFieldNames.range)}
				ValueLabels={["Min", "Max"]}
			/>
		</Node>
	);
}
