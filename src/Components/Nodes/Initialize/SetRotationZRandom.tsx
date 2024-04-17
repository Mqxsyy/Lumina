import Roact, { useRef } from "@rbxts/roact";
import { SetRotationZRandom as SetRotationZRandomAPI } from "API/Nodes/Initialize/SetRotationZRandom";
import { Vector2Field } from "Components/NodeFields/Vector2Field";
import { AddNode, NodeData } from "Services/NodesService";
import { Node } from "../Node";

export function CreateRotationZRandom() {
	return AddNode(new SetRotationZRandomAPI(), (data: NodeData) => {
		return <SetRotationZRandom data={data} />;
	});
}

function SetRotationZRandom({ data }: { data: NodeData }) {
	const rangeFieldRef = useRef((data.node as SetRotationZRandomAPI).nodeFields.range);

	return (
		<Node Name="Set Rotation Z Random" Id={data.id} AnchorPoint={data.anchorPoint}>
			<Vector2Field
				Label={"Range"}
				ValueLabels={["Min", "Max"]}
				DefaultValues={rangeFieldRef.current.GetVector2()}
				Vector2Changed={rangeFieldRef.current.SetVector2}
			/>
		</Node>
	);
}
