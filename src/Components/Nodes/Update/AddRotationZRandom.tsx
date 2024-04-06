import Roact, { useRef } from "@rbxts/roact";
import { Event } from "API/Bindables/Event";
import { AddRotationZRandom as AddRotationZRandomAPI } from "API/Nodes/Update/AddRotationZRandom";
import { Vector2Field } from "Components/NodeFields/Vector2Field";
import { AddNode, GetNextNodeId, NodeData } from "Services/NodesService";
import { GetMousePositionOnCanvas } from "Windows/MainWindow";
import { Node } from "../Node";

export function CreateAddRotationZRandom() {
	AddNode({
		data: {
			id: GetNextNodeId(),
			anchorPoint: GetMousePositionOnCanvas(),
			node: new AddRotationZRandomAPI(),
			elementLoaded: new Event(),
		},
		create: (data: NodeData) => {
			return <AddRotationZRandom key={data.id} data={data} />;
		},
	});
}

function AddRotationZRandom({ data }: { data: NodeData }) {
	const rangeFieldRef = useRef((data.node as AddRotationZRandomAPI).nodeFields.range);

	return (
		<Node Name="Add Rotation Z Random" Id={data.id} AnchorPoint={data.anchorPoint}>
			<uipadding PaddingLeft={new UDim(0, 10)} />

			<Vector2Field
				Label={"Range"}
				ValueLabels={["Min", "Max"]}
				DefaultValues={rangeFieldRef.current.GetVector2()}
				Vector2Changed={rangeFieldRef.current.SetVector2}
			/>
		</Node>
	);
}
