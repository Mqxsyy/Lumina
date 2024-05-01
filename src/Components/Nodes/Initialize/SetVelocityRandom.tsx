import Roact from "@rbxts/roact";
import { CapitalizeFirstLetter } from "API/Lib";
import {
	SetVelocityRandom as SetVelocityRandomAPI,
	SetVelocityRandomFieldNames,
} from "API/Nodes/Initialize/SetVelocityRandom";
import { Vector2Field } from "Components/NodeFields/Vector2Field";
import { AddNode, NodeData } from "Services/NodesService";
import Node from "../Node";

export function CreateSetVelocityRandom() {
	return AddNode(new SetVelocityRandomAPI(), (data: NodeData) => {
		return <SetVelocityRandom key={`node_${data.node.id}`} data={data} />;
	});
}

function SetVelocityRandom({ data }: { data: NodeData }) {
	return (
		<Node
			Name="Set Velocity Random"
			NodeId={data.node.id}
			NodeAnchorPoint={data.anchorPoint}
			IsConnectedToSystem={data.node.connectedSystemId !== undefined}
		>
			<Vector2Field
				NodeId={data.node.id}
				NodeField={(data.node as SetVelocityRandomAPI).nodeFields.rangeX}
				NodeFieldName={SetVelocityRandomFieldNames.rangeX}
				Label={CapitalizeFirstLetter(SetVelocityRandomFieldNames.rangeX)}
				ValueLabels={["Min", "Max"]}
			/>
			<Vector2Field
				NodeId={data.node.id}
				NodeField={(data.node as SetVelocityRandomAPI).nodeFields.rangeY}
				NodeFieldName={SetVelocityRandomFieldNames.rangeY}
				Label={CapitalizeFirstLetter(SetVelocityRandomFieldNames.rangeY)}
				ValueLabels={["Min", "Max"]}
			/>
			<Vector2Field
				NodeId={data.node.id}
				NodeField={(data.node as SetVelocityRandomAPI).nodeFields.rangeZ}
				NodeFieldName={SetVelocityRandomFieldNames.rangeZ}
				Label={CapitalizeFirstLetter(SetVelocityRandomFieldNames.rangeZ)}
				ValueLabels={["Min", "Max"]}
			/>
		</Node>
	);
}
