import Roact, { useRef } from "@rbxts/roact";
import { Event } from "API/Bindables/Event";
import { SetVelocity as SetVelocityAPI } from "API/Nodes/Initialize/SetVelocity";
import { Vector3Field } from "Components/NodeFields/Vector3Field";
import { AddNode, GetNextNodeId, NodeData } from "Services/NodesService";
import { GetMousePositionOnCanvas } from "Windows/MainWindow";
import { Node } from "../Node";

export function CreateSetVelocity() {
	return AddNode({
		data: {
			id: GetNextNodeId(),
			anchorPoint: GetMousePositionOnCanvas(),
			node: new SetVelocityAPI(),
			elementLoaded: new Event(),
		},
		create: (data: NodeData) => {
			return <SetVelocity key={data.id} data={data} />;
		},
	});
}

function SetVelocity({ data }: { data: NodeData }) {
	const velocityFieldRef = useRef((data.node as SetVelocityAPI).nodeFields.velocity);

	return (
		<Node Name="Set Velocity" Id={data.id} AnchorPoint={data.anchorPoint}>
			<uipadding PaddingLeft={new UDim(0, 10)} />

			<Vector3Field
				NodeField={velocityFieldRef.current}
				Label={"Velocity"}
				DefaultValue={velocityFieldRef.current.GetVector3()}
			/>
		</Node>
	);
}
