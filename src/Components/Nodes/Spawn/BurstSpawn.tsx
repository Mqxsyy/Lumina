import Roact, { useRef } from "@rbxts/roact";
import { BurstSpawn as BurstSpawnAPI } from "API/Nodes/Spawn/BurstSpawn";
import { NumberField } from "Components/NodeFields/NumberField";
import { AddNode, NodeData } from "Services/NodesService";
import { Node } from "../Node";

export function CreateBurstSpawn() {
	return AddNode(new BurstSpawnAPI(), (data: NodeData) => {
		return <BurstSpawn key={`node_${data.node.id}`} data={data} />;
	});
}

function BurstSpawn({ data }: { data: NodeData }) {
	const amountFieldRef = useRef((data.node as BurstSpawnAPI).nodeFields.amount);

	const rateChanged = (number: number) => {
		amountFieldRef.current.SetNumber(number);
	};

	return (
		<Node Name="Burst Spawn" Id={data.node.id} AnchorPoint={data.anchorPoint}>
			<NumberField
				Label="Amount"
				DefaultText={tostring(amountFieldRef.current.GetNumber())}
				NumberChanged={rateChanged}
			/>
		</Node>
	);
}
