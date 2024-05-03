import React from "@rbxts/react";
import { SetVelocity as SetVelocityAPI, SetVelocityFieldNames } from "API/Nodes/Initialize/SetVelocity";
import { Vector3Field } from "Components/NodeFields/Vector3Field";
import { AddNode, NodeData } from "Services/NodesService";
import Node from "../Node";

export function CreateSetVelocity() {
	return AddNode(new SetVelocityAPI(), (data: NodeData) => {
		return <SetVelocity key={`node_${data.node.id}`} data={data} />;
	});
}

function SetVelocity({ data }: { data: NodeData }) {
	return (
		<Node
			Name="Set Velocity"
			NodeId={data.node.id}
			NodeAnchorPoint={data.anchorPoint}
			IsConnectedToSystem={data.node.connectedSystemId !== undefined}
		>
			<Vector3Field
				NodeId={data.node.id}
				NodeField={(data.node as SetVelocityAPI).nodeFields.velocity}
				NodeFieldName={SetVelocityFieldNames.velocity}
				Label={"Velocity"}
			/>
		</Node>
	);
}
