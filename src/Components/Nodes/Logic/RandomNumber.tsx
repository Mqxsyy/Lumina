import Roact, { useRef } from "@rbxts/roact";
import { RandomNumber as RandomNumberAPI } from "API/Nodes/Logic/RandomNumber";
import { Vector2Field } from "Components/NodeFields/Vector2Field";
import { AddNode, GetNextNodeId, NodeData } from "Services/NodesService";
import { GetMousePositionOnCanvas } from "Windows/MainWindow";
import { Node } from "../Node";
import { Event } from "API/Bindables/Event";
import { LogicNode } from "API/Nodes/Logic/LogicNode";

export function CreateRandomNumber() {
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
	const vector2FieldRef = useRef((data.node as RandomNumberAPI).nodeFields.range);

	const GetValue = () => (data.node as LogicNode<number>).Calculate();

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
				DefaultValues={new Vector2(0, 10)}
				Vector2Changed={vector2FieldRef.current.SetVector2}
			/>
		</Node>
	);
}
