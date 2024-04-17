import Roact, { useRef } from "@rbxts/roact";
import { LogicNode } from "API/Nodes/Logic/LogicNode";
import { RandomNumber as RandomNumberAPI } from "API/Nodes/Logic/RandomNumber";
import { Vector2Field } from "Components/NodeFields/Vector2Field";
import { AddNode, NodeData } from "Services/NodesService";
import { Node } from "../Node";

export function CreateRandomNumber() {
	return AddNode(new RandomNumberAPI(), (data: NodeData) => {
		return <RandomNumber key={data.id} data={data} />;
	});
}

function RandomNumber({ data }: { data: NodeData }) {
	const vector2FieldRef = useRef((data.node as RandomNumberAPI).nodeFields.range);

	return (
		<Node
			Name="Random Number"
			Id={data.id}
			AnchorPoint={data.anchorPoint}
			ConnectionFunction={(data.node as LogicNode<number>).Calculate}
			ConnectioNode={data.node as LogicNode}
		>
			<Vector2Field
				Label={"Vector3"}
				ValueLabels={["Min", "Max"]}
				DefaultValues={new Vector2(0, 10)}
				Vector2Changed={vector2FieldRef.current.SetVector2}
			/>
		</Node>
	);
}
