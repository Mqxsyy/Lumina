import React from "@rbxts/react";
import { CapitalizeFirstLetter } from "API/Lib";
import { Drag as DragAPI, DragFieldNames } from "API/Nodes/Update/Drag";
import NumberField from "Components/NodeFields/NumberField";
import { AddNode, NodeData } from "Services/NodesService";
import Node from "../Node";

export function CreateDrag() {
	return AddNode(new DragAPI(), (data: NodeData) => {
		return <Drag key={`node_${data.node.id}`} data={data} />;
	});
}

function Drag({ data }: { data: NodeData }) {
	return (
		<Node
			Name="Drag"
			NodeId={data.node.id}
			NodeAnchorPoint={data.anchorPoint}
			IsConnectedToSystem={data.node.connectedSystemId !== undefined}
		>
			<NumberField
				NodeId={data.node.id}
				NodeField={(data.node as DragAPI).nodeFields.drag}
				NodeFieldName={DragFieldNames.drag}
				Label={CapitalizeFirstLetter(DragFieldNames.drag)}
			/>
		</Node>
	);
}
