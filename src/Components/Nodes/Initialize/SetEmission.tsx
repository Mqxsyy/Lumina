import Roact from "@rbxts/roact";
import { SetEmission as SetEmissionAPI, SetEmissionFieldNames } from "API/Nodes/Initialize/SetEmission";
import NumberField from "Components/NodeFields/NumberField";
import { AddNode, NodeData } from "Services/NodesService";
import { Node } from "../Node";
import { CapitalizeFirstLetter } from "API/Lib";

export function CreateSetEmission() {
	return AddNode(new SetEmissionAPI(), (data: NodeData) => {
		return <SetEmission key={`node_${data.node.id}`} data={data} />;
	});
}

function SetEmission({ data }: { data: NodeData }) {
	return (
		<Node Name="Set Emission" NodeData={data}>
			<NumberField
				NodeId={data.node.id}
				NodeField={(data.node as SetEmissionAPI).nodeFields.emission}
				NodeFieldName={SetEmissionFieldNames.emission}
				Label={CapitalizeFirstLetter(SetEmissionFieldNames.emission)}
			/>
		</Node>
	);
}
