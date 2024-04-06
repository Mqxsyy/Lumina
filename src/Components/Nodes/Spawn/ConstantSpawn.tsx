import Roact, { useRef } from "@rbxts/roact";
import { ConstantSpawn as ConstantSpawnAPI } from "API/Nodes/Spawn/ConstantSpawn";
import { NumberField } from "Components/NodeFields/NumberField";
import { AddNode, GetNextNodeId, NodeData } from "Services/NodesService";
import { Node } from "../Node";
import { Event } from "API/Bindables/Event";
import { GetMousePositionOnCanvas } from "Windows/MainWindow";

export function CreateConstantSpawn() {
	return AddNode({
		data: {
			id: GetNextNodeId(),
			anchorPoint: GetMousePositionOnCanvas(),
			node: new ConstantSpawnAPI(),
			elementLoaded: new Event(),
		},
		create: (data: NodeData) => {
			return <ConstantSpawn key={data.id} data={data} />;
		},
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
		<Node Name="Constant Spawn" Id={data.id} AnchorPoint={data.anchorPoint}>
			<uipadding PaddingLeft={new UDim(0, 10)} />
			<NumberField
				Label="Rate"
				DefaultText={tostring(rateFieldRef.current.GetNumber())}
				NumberChanged={rateChanged}
			/>
		</Node>
	);
}
