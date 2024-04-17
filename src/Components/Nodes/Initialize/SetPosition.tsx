import Roact, { useRef } from "@rbxts/roact";
import { SetPosition as SetPositionAPI, SetPositionFieldNames } from "API/Nodes/Initialize/SetPosition";
import { Vector3Field } from "Components/NodeFields/Vector3Field";
import { AddNode, NodeData } from "Services/NodesService";
import { Node } from "../Node";

export function CreateSetPosition() {
	return AddNode(new SetPositionAPI(), (data: NodeData) => {
		return <SetPosition data={data} />;
	});
}

function SetPosition({ data }: { data: NodeData }) {
	const positionFieldRef = useRef((data.node as SetPositionAPI).nodeFields.position);

	return (
		<Node Name="Set Position" Id={data.id} AnchorPoint={data.anchorPoint}>
			<uipadding PaddingLeft={new UDim(0, 10)} />

			<Vector3Field
				NodeId={data.id}
				NodeAnchorPoint={data.anchorPoint}
				NodeField={positionFieldRef.current}
				NodeFieldName={SetPositionFieldNames.position}
				Label={"Position"}
				DefaultValue={positionFieldRef.current.GetVector3()}
			/>
		</Node>
	);
}
