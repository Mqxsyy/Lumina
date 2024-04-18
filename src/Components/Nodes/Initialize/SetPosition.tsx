import Roact, { useRef } from "@rbxts/roact";
import { SetPosition as SetPositionAPI, SetPositionFieldNames } from "API/Nodes/Initialize/SetPosition";
import { Vector3Field } from "Components/NodeFields/Vector3Field";
import { AddNode, NodeData } from "Services/NodesService";
import { Node } from "../Node";

export function CreateSetPosition() {
	return AddNode(new SetPositionAPI(), (data: NodeData) => {
		return <SetPosition key={`node_${data.node.id}`} data={data} />;
	});
}

function SetPosition({ data }: { data: NodeData }) {
	const positionFieldRef = useRef((data.node as SetPositionAPI).nodeFields.position);

	return (
		<Node Name="Set Position" Id={data.node.id} AnchorPoint={data.anchorPoint}>
			<Vector3Field
				NodeId={data.node.id}
				NodeAnchorPoint={data.anchorPoint}
				NodeField={positionFieldRef.current}
				NodeFieldName={SetPositionFieldNames.position}
				Label={"Position"}
				DefaultValue={positionFieldRef.current.GetVector3()}
			/>
		</Node>
	);
}
