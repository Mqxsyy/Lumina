import Roact from "@rbxts/roact";
import { Node } from "../Node";
import { AddNode, GetNextNodeId, NodeData } from "Services/NodesService";
import { GetMousePositionOnCanvas } from "WidgetHandler";
import { RandomNumber as RandomNumberAPI } from "API/Nodes/Logic/Math/RandomNumber";

export function CreateRandomNumberNode() {
	AddNode({
		data: {
			id: GetNextNodeId(),
			anchorPoint: GetMousePositionOnCanvas(),
			node: new RandomNumberAPI(),
		},
		create: (data: NodeData) => {
			return <RandomNumber key={data.id} data={data} />;
		},
	});
}

function RandomNumber({ data }: { data: NodeData }) {
	return <Node Name="Random Number" Id={data.id} AnchorPoint={data.anchorPoint} />;
}
