import Roact, { useRef } from "@rbxts/roact";
import { AddRotationZ as AddRotationZAPI, AddRotationZFieldNames } from "API/Nodes/Update/AddRotationZ";
import NumberFieldConnectionIn from "Components/NodeFields/NumberFieldConnectionIn";
import { AddNode, NodeData } from "Services/NodesService";
import { Node } from "../Node";

export function CreateAddRotationZ() {
	return AddNode(new AddRotationZAPI(), (data: NodeData) => {
		return <AddRotationZ key={`node_${data.node.id}`} data={data} />;
	});
}

function AddRotationZ({ data }: { data: NodeData }) {
	const rotationFieldRef = useRef((data.node as AddRotationZAPI).nodeFields.rotation);

	return (
		<Node Name="Add Rotation Z" Id={data.node.id} AnchorPoint={data.anchorPoint}>
			<NumberFieldConnectionIn
				NodeId={data.node.id}
				NodeFieldName={AddRotationZFieldNames.rotation}
				NodeAbsolutePosition={data.anchorPoint}
				DefaultText={tostring(rotationFieldRef.current.GetNumber())}
				InputDisabled={rotationFieldRef.current.boundNode !== undefined}
				NumberChanged={rotationFieldRef.current.SetNumber}
				BindFunction={rotationFieldRef.current.BindNumber}
				UnbindFunction={rotationFieldRef.current.UnbindNumber}
			/>
		</Node>
	);
}
