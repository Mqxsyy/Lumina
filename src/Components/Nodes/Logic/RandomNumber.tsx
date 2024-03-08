import Roact from "@rbxts/roact";
import { RandomNumber as RandomNumberAPI } from "API/Nodes/Logic/Math/RandomNumber";
import { Vector2Field } from "Components/NodeFields/Vector2Field";
import { AddNode, GetNextNodeId, NodeData } from "Services/NodesService";
import { GetMousePositionOnCanvas } from "WidgetHandler";
import { Node } from "../Node";

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
	const vector2Changed = (vector2: Vector2) => {
		const vector2Field = (data.node as RandomNumberAPI).nodeFields.range;
		vector2Field.SetValue(vector2);
	};

	return (
		<Node Name="Position" Id={data.id} AnchorPoint={data.anchorPoint}>
			<uipadding PaddingLeft={new UDim(0, 10)} />
			<Vector2Field
				Label={"Vector3"}
				ValueLabels={["Min", "Max"]}
				DefaultValue={new Vector2(0, 10)}
				Vector2Changed={vector2Changed}
			/>
		</Node>
	);
}
