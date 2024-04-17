import Roact, { useRef } from "@rbxts/roact";
import { AddRotationZRandom as AddRotationZRandomAPI } from "API/Nodes/Update/AddRotationZRandom";
import { Vector2Field } from "Components/NodeFields/Vector2Field";
import { AddNode, NodeData } from "Services/NodesService";
import { Node } from "../Node";

export function CreateAddRotationZRandom() {
	return AddNode(new AddRotationZRandomAPI(), (data: NodeData) => {
		return <AddRotationZRandom data={data} />;
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
