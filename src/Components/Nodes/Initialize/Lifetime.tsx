import Roact from "@rbxts/roact";
import { Lifetime as LifetimeAPI } from "API/Nodes/Initialize/Lifetime";
import { NumberField } from "Components/NodeFields/NumberField";
import { AddNode, GetNextNodeId, NodeData } from "Services/NodesService";
import { GetMousePositionOnCanvas } from "WidgetHandler";
import { Node } from "../Node";
import { Event } from "API/Event";

export function CreateLifetimeNode() {
	return AddNode({
		data: {
			id: GetNextNodeId(),
			anchorPoint: GetMousePositionOnCanvas(),
			node: new LifetimeAPI(),
			elementLoaded: new Event(),
		},
		create: (data: NodeData) => {
			return <Lifetime key={data.id} data={data} />;
		},
	});
}

function Lifetime({ data }: { data: NodeData }) {
	const timeChanged = (number: number) => {
		const timeField = (data.node as LifetimeAPI).nodeFields.time;
		timeField.SetValue(number);
	};

	return (
		<Node Name="Lifetime" Id={data.id} AnchorPoint={data.anchorPoint}>
			<uipadding PaddingLeft={new UDim(0, 10)} />
			<NumberField Label="Time" DefaultText="1" NumberChanged={timeChanged} />
		</Node>
	);
}
