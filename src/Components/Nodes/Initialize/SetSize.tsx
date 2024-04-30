import Roact from "@rbxts/roact";
import { CapitalizeFirstLetter } from "API/Lib";
import { SetSize as SetSizeAPI, SetSizeFieldNames } from "API/Nodes/Initialize/SetSize";
import NumberField from "Components/NodeFields/NumberField";
import { AddNode, NodeData } from "Services/NodesService";
import { Node } from "../Node";

export function CreateSetSize() {
	return AddNode(new SetSizeAPI(), (data: NodeData) => {
		return <SetSize key={`node_${data.node.id}`} data={data} />;
	});
}

function SetSize({ data }: { data: NodeData }) {
	return (
		<Node Name="Set Size" NodeData={data}>
			<NumberField
				NodeId={data.node.id}
				NodeField={(data.node as SetSizeAPI).nodeFields.size}
				NodeFieldName={SetSizeFieldNames.size}
				Label={CapitalizeFirstLetter(SetSizeFieldNames.size)}
			/>
		</Node>
	);
}
