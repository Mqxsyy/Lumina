import Roact from "@rbxts/roact";
import { CapitalizeFirstLetter } from "API/Lib";
import {
	SetLifetimeRandom as SetLifetimeRandomAPI,
	SetLifetimeRandomFieldNames,
} from "API/Nodes/Initialize/SetLifetimeRandom";
import { Vector2Field } from "Components/NodeFields/Vector2Field";
import { AddNode, NodeData } from "Services/NodesService";
import { Node } from "../Node";

export function CreateSetLifetimeRandom() {
	return AddNode(new SetLifetimeRandomAPI(), (data: NodeData) => {
		return <SetLifetimeRandom key={`node_${data.node.id}`} data={data} />;
	});
}

function SetLifetimeRandom({ data }: { data: NodeData }) {
	return (
		<Node Name="Set Lifetime Random" NodeData={data}>
			<Vector2Field
				NodeId={data.node.id}
				NodeField={(data.node as SetLifetimeRandomAPI).nodeFields.range}
				NodeFieldName={SetLifetimeRandomFieldNames.range}
				Label={CapitalizeFirstLetter(SetLifetimeRandomFieldNames.range)}
				ValueLabels={["Min", "Max"]}
			/>
		</Node>
	);
}
