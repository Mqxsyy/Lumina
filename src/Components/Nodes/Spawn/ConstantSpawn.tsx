import Roact, { useRef } from "@rbxts/roact";
import { ConstantSpawn as ConstantSpawnAPI, ConstantSpawnFieldNames } from "API/Nodes/Spawn/ConstantSpawn";
import { AddNode, NodeData } from "Services/NodesService";
import { Node } from "../Node";
import NumberField from "Components/NodeFields/NumberField";
import { CapitalizeFirstLetter } from "API/Lib";

export function CreateConstantSpawn() {
	return AddNode(new ConstantSpawnAPI(), (data: NodeData) => {
		return <ConstantSpawn key={`node_${data.node.id}`} data={data} />;
	});
}

function ConstantSpawn({ data }: { data: NodeData }) {
	const rateFieldRef = useRef((data.node as ConstantSpawnAPI).nodeFields.rate);

	const rateChanged = (number: number) => {
		if (number > 1000) {
			rateFieldRef.current.SetNumber(1000);
		}

		rateFieldRef.current.SetNumber(number);
	};

	return (
		<Node Name="Constant Spawn" NodeData={data}>
			<NumberField
				NodeId={data.node.id}
				NodeField={(data.node as ConstantSpawnAPI).nodeFields.rate}
				NodeFieldName={ConstantSpawnFieldNames.rate}
				Label={CapitalizeFirstLetter(ConstantSpawnFieldNames.rate)}
				AllowConnection={false}
				OverrideSetNumber={rateChanged}
			/>
		</Node>
	);
}
