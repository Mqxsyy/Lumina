import Roact from "@rbxts/roact";
import { CapitalizeFirstLetter } from "API/Lib";
import { BurstSpawn as BurstSpawnAPI, BurstSpawnFieldNames } from "API/Nodes/Spawn/BurstSpawn";
import NumberField from "Components/NodeFields/NumberField";
import { AddNode, NodeData } from "Services/NodesService";
import { Node } from "../Node";

export function CreateBurstSpawn() {
	return AddNode(new BurstSpawnAPI(), (data: NodeData) => {
		return <BurstSpawn key={`node_${data.node.id}`} data={data} />;
	});
}

function BurstSpawn({ data }: { data: NodeData }) {
	return (
		<Node Name="Burst Spawn" Id={data.node.id} AnchorPoint={data.anchorPoint}>
			<NumberField
				NodeId={data.node.id}
				NodeField={(data.node as BurstSpawnAPI).nodeFields.amount}
				NodeFieldName={BurstSpawnFieldNames.amount}
				Label={CapitalizeFirstLetter(BurstSpawnFieldNames.amount)}
				AllowConnection={false}
			/>
		</Node>
	);
}
