import Roact, { useRef } from "@rbxts/roact";
import { SetSizeRandom as SetSizeRandomAPI } from "API/Nodes/Initialize/SetSizeRandom";
import { Vector2Field } from "Components/NodeFields/Vector2Field";
import { AddNode, NodeData } from "Services/NodesService";
import { Node } from "../Node";

export function CreateSetSizeRandom() {
	return AddNode(new SetSizeRandomAPI(), (data: NodeData) => {
		return <SetSizeRandom key={`node_${data.node.id}`} data={data} />;
	});
}

function SetSizeRandom({ data }: { data: NodeData }) {
	const rangeFieldRef = useRef((data.node as SetSizeRandomAPI).nodeFields.range);

	return (
		<Node Name="Set Size Random" Id={data.node.id} AnchorPoint={data.anchorPoint}>
			<Vector2Field
				Label={"Range"}
				ValueLabels={["Min", "Max"]}
				DefaultValues={rangeFieldRef.current.GetVector2()}
				Vector2Changed={rangeFieldRef.current.SetVector2}
			/>
		</Node>
	);
}
