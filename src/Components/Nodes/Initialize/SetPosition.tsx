import React from "@rbxts/react";
import { SetPosition as SetPositionAPI, SetPositionFieldNames } from "API/Nodes/Initialize/SetPosition";
import { Vector3Field } from "Components/NodeFields/Vector3Field";
import { AddNode, NodeData } from "Services/NodesService";
import Node from "../Node";

export function CreateSetPosition() {
	return AddNode(new SetPositionAPI(), (data: NodeData) => {
		return <SetPosition key={`node_${data.node.id}`} data={data} />;
	});
}

function SetPosition({ data }: { data: NodeData }) {
	return (
		<Node
			Name="Set Position"
			NodeId={data.node.id}
			NodeAnchorPoint={data.anchorPoint}
			IsConnectedToSystem={data.node.connectedSystemId !== undefined}
		>
			<Vector3Field
				NodeId={data.node.id}
				NodeField={(data.node as SetPositionAPI).nodeFields.position}
				NodeFieldName={SetPositionFieldNames.position}
			/>
		</Node>
	);
}
