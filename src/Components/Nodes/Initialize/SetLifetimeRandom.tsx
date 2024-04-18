import Roact, { useRef } from "@rbxts/roact";
import { SetLifetimeRandom as SetLifetimeRandomAPI } from "API/Nodes/Initialize/SetLifetimeRandom";
import { Vector2Field } from "Components/NodeFields/Vector2Field";
import { AddNode, NodeData } from "Services/NodesService";
import { Node } from "../Node";

export function CreateSetLifetimeRandom() {
	return AddNode(new SetLifetimeRandomAPI(), (data: NodeData) => {
		return <SetLifetimeRandom key={`node_${data.node.id}`} data={data} />;
	});
}

function SetLifetimeRandom({ data }: { data: NodeData }) {
	const rangeFieldRef = useRef((data.node as SetLifetimeRandomAPI).nodeFields.range);

	return (
		<Node Name="Set Lifetime Random" Id={data.node.id} AnchorPoint={data.anchorPoint}>
			<Vector2Field
				Label={"Range"}
				ValueLabels={["Min", "Max"]}
				DefaultValues={rangeFieldRef.current.GetVector2()}
				Vector2Changed={rangeFieldRef.current.SetVector2}
			/>
		</Node>
	);
}
