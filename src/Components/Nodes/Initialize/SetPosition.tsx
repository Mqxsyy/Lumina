import Roact from "@rbxts/roact";
import { CapitalizeFirstLetter } from "API/Lib";
import { SetPosition as SetPositionAPI, SetPositionFieldNames } from "API/Nodes/Initialize/SetPosition";
import { Vector3Field } from "Components/NodeFields/Vector3Field";
import { AddNode, NodeData } from "Services/NodesService";
import { Node } from "../Node";

export function CreateSetPosition() {
	return AddNode(new SetPositionAPI(), (data: NodeData) => {
		return <SetPosition key={`node_${data.node.id}`} data={data} />;
	});
}

function SetPosition({ data }: { data: NodeData }) {
	return (
		<Node Name="Set Position" NodeData={data}>
			<Vector3Field
				NodeId={data.node.id}
				NodeField={(data.node as SetPositionAPI).nodeFields.position}
				NodeFieldName={SetPositionFieldNames.position}
				Label={CapitalizeFirstLetter(SetPositionFieldNames.position)}
			/>
		</Node>
	);
}
