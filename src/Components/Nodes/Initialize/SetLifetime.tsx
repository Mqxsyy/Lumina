import Roact from "@rbxts/roact";
import { CapitalizeFirstLetter } from "API/Lib";
import { SetLifetime as SetLifetimeAPI, SetLifetimeFieldNames } from "API/Nodes/Initialize/SetLifetime";
import NumberField from "Components/NodeFields/NumberField";
import { AddNode, NodeData } from "Services/NodesService";
import { Node } from "../Node";

export function CreateSetLifetime() {
	return AddNode(new SetLifetimeAPI(), (data: NodeData) => {
		return <SetLifetime key={`node_${data.node.id}`} data={data} />;
	});
}

function SetLifetime({ data }: { data: NodeData }) {
	return (
		<Node Name="Set Lifetime" Id={data.node.id} AnchorPoint={data.anchorPoint}>
			<NumberField
				NodeId={data.node.id}
				NodeField={(data.node as SetLifetimeAPI).nodeFields.time}
				NodeFieldName={SetLifetimeFieldNames.time}
				Label={CapitalizeFirstLetter(SetLifetimeFieldNames.time)}
			/>
		</Node>
	);
}
