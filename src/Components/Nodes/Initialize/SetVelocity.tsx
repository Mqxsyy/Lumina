import Roact, { useRef } from "@rbxts/roact";
import { SetVelocity as SetVelocityAPI, SetVelocityFieldNames } from "API/Nodes/Initialize/SetVelocity";
import { Vector3Field } from "Components/NodeFields/Vector3Field";
import { AddNode, NodeData } from "Services/NodesService";
import { Node } from "../Node";

export function CreateSetVelocity() {
	return AddNode(new SetVelocityAPI(), (data: NodeData) => {
		return <SetVelocity key={data.id} data={data} />;
	});
}

function SetVelocity({ data }: { data: NodeData }) {
	const velocityFieldRef = useRef((data.node as SetVelocityAPI).nodeFields.velocity);

	return (
		<Node Name="Set Velocity" Id={data.id} AnchorPoint={data.anchorPoint}>
			<uipadding PaddingLeft={new UDim(0, 10)} />

			<Vector3Field
				NodeId={data.id}
				NodeAnchorPoint={data.anchorPoint}
				NodeField={velocityFieldRef.current}
				NodeFieldName={SetVelocityFieldNames.velocity}
				Label={"Velocity"}
				DefaultValue={velocityFieldRef.current.GetVector3()}
			/>
		</Node>
	);
}
