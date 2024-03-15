import Roact from "@rbxts/roact";
import { RandomNumber as RandomNumberAPI } from "API/Nodes/Logic/Math/RandomNumber";
import { Vector2Field } from "Components/NodeFields/Vector2Field";
import { AddNode, GetNextNodeId, NodeData } from "Services/NodesService";
import { GetMousePositionOnCanvas } from "WidgetHandler";
import { Node } from "../Node";
import { Event } from "API/Event";
import { LogicNode } from "API/Nodes/Logic/LogicNode";

export function CreateRandomNumberNode() {
	AddNode({
		data: {
			id: GetNextNodeId(),
			anchorPoint: GetMousePositionOnCanvas(),
			node: new RandomNumberAPI(),
			elementLoaded: new Event(),
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

	const GetValue = () => {
		return (data.node as LogicNode).Calculate() as number;
	};

	return (
		<Node
			Name="Random Number"
			Id={data.id}
			AnchorPoint={data.anchorPoint}
			ConnectionFunction={GetValue}
			ConnectioNode={data.node as LogicNode}
		>
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
