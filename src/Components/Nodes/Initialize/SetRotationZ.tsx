import React from "@rbxts/react";
import { CapitalizeFirstLetter } from "API/Lib";
import { SetRotationZ as SetRotationZAPI, SetRotationZFieldNames } from "API/Nodes/Initialize/SetRotationZ";
import NumberField from "Components/NodeFields/NumberField";
import { AddNode, NodeData } from "Services/NodesService";
import Node from "../Node";

export function CreateSetRotationZ() {
	return AddNode(new SetRotationZAPI(), (data: NodeData) => {
		return <SetRotationZ key={`node_${data.node.id}`} data={data} />;
	});
}

function SetRotationZ({ data }: { data: NodeData }) {
	return (
		<Node
			Name="Set Rotation Z"
			NodeId={data.node.id}
			NodeAnchorPoint={data.anchorPoint}
			IsConnectedToSystem={data.node.connectedSystemId !== undefined}
		>
			<NumberField
				NodeId={data.node.id}
				NodeField={(data.node as SetRotationZAPI).nodeFields.rotation}
				NodeFieldName={SetRotationZFieldNames.rotation}
				Label={CapitalizeFirstLetter(SetRotationZFieldNames.rotation)}
			/>
		</Node>
	);
}
