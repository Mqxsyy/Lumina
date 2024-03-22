import Roact from "@rbxts/roact";
import { ConstantSpawn as ConstantSpawnAPI } from "API/Nodes/Spawn/ConstantSpawn";
import { NumberField } from "Components/NodeFields/NumberField";
import { AddNode, GetNextNodeId, NodeData } from "Services/NodesService";
import { GetMousePositionOnCanvas } from "WidgetHandler";
import { Node } from "../Node";
import { Event } from "API/Bindables/Event";

export function CreateConstantSpawnNode() {
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
	const rateChanged = (number: number) => {
		const rateField = (data.node as ConstantSpawnAPI).nodeFields.rate;

		if (number > 1000) {
			rateField.SetValue(1000);
		}

		rateField.SetValue(number);
	};

	return (
		<Node Name="Constant Spawn" Id={data.id} AnchorPoint={data.anchorPoint}>
			<uipadding PaddingLeft={new UDim(0, 10)} />
			<NumberField Label="Rate" DefaultText="20" NumberChanged={rateChanged} />
		</Node>
	);
}
