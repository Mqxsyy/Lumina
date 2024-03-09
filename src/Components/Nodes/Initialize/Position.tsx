import Roact from "@rbxts/roact";
import { Position as PositionAPI } from "API/Nodes/Initialize/Position";
import { Vector3Field } from "Components/NodeFields/Vector3Field";
import { AddNode, GetNextNodeId, NodeData } from "Services/NodesService";
import { GetMousePositionOnCanvas } from "WidgetHandler";
import { Node } from "../Node";
import { Event } from "API/Event";

export function CreatePositionNode() {
	AddNode({
		data: {
			id: GetNextNodeId(),
			anchorPoint: GetMousePositionOnCanvas(),
			node: new PositionAPI(),
			elementLoaded: new Event(),
		},
		create: (data: NodeData) => {
			return <Position key={data.id} data={data} />;
		},
	});
}

function Position({ data }: { data: NodeData }) {
	const vector3Changed = (vector3: Vector3) => {
		const vector3Field = (data.node as PositionAPI).nodeFields.position;
		vector3Field.SetValue(vector3);
	};

	return (
		<Node Name="Position" Id={data.id} AnchorPoint={data.anchorPoint}>
			<uipadding PaddingLeft={new UDim(0, 10)} />
			<Vector3Field Label={"Vector3"} DefaultValue={Vector3.zero} Vector3Changed={vector3Changed} />
		</Node>
	);
}
