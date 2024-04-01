import Roact from "@rbxts/roact";
import { Event } from "API/Bindables/Event";
import { SetPosition as SetPositionAPI } from "API/Nodes/Initialize/SetPosition";
import { Vector3Field } from "Components/NodeFields/Vector3Field";
import { AddNode, GetNextNodeId, NodeData } from "Services/NodesService";
import { GetMousePositionOnCanvas } from "Windows/MainWindow";
import { Node } from "../Node";

export function CreateSetPosition() {
	return AddNode({
		data: {
			id: GetNextNodeId(),
			anchorPoint: GetMousePositionOnCanvas(),
			node: new SetPositionAPI(),
			elementLoaded: new Event(),
		},
		create: (data: NodeData) => {
			return <SetPosition key={data.id} data={data} />;
		},
	});
}

function SetPosition({ data }: { data: NodeData }) {
	return (
		<Node Name="Set Position" Id={data.id} AnchorPoint={data.anchorPoint}>
			<uipadding PaddingLeft={new UDim(0, 10)} />

			<Vector3Field
				NodeField={(data.node as SetPositionAPI).nodeFields.position}
				Label={"Position"}
				DefaultValue={(data.node as SetPositionAPI).nodeFields.position.GetValue()}
			/>
		</Node>
	);
}