import React from "@rbxts/react";
import { CapitalizeFirstLetter } from "API/Lib";
import { ConstantSpawn as ConstantSpawnAPI, ConstantSpawnFieldNames } from "API/Nodes/Spawn/ConstantSpawn";
import NumberField from "Components/NodeFields/NumberField";
import { AddNode, NodeData } from "Services/NodesService";
import Node from "../Node";

export function CreateConstantSpawn() {
	return AddNode(new ConstantSpawnAPI(), (data: NodeData) => {
		return <ConstantSpawn key={`node_${data.node.id}`} data={data} />;
	});
}

function ConstantSpawn({ data }: { data: NodeData }) {
	const { node } = data;
	const { id, nodeFields } = node as ConstantSpawnAPI;

	const rateChanged = (number: number) => {
		if (number > 1000) {
			nodeFields.rate.SetNumber(1000);
		}

		nodeFields.rate.SetNumber(number);
	};

	return (
		<Node
			Name="Constant Spawn"
			NodeId={data.node.id}
			NodeAnchorPoint={data.anchorPoint}
			IsConnectedToSystem={data.node.connectedSystemId !== undefined}
		>
			<NumberField
				NodeId={id}
				NodeField={nodeFields.rate}
				NodeFieldName={ConstantSpawnFieldNames.rate}
				Label={CapitalizeFirstLetter(ConstantSpawnFieldNames.rate)}
				AllowConnection={false}
				OverrideSetNumber={rateChanged}
			/>
		</Node>
	);
}
