import Roact from "@rbxts/roact";
import { CapitalizeFirstLetter } from "API/Lib";
import { AddRotationZ as AddRotationZAPI, AddRotationZFieldNames } from "API/Nodes/Update/AddRotationZ";
import NumberField from "Components/NodeFields/NumberField";
import { AddNode, NodeData } from "Services/NodesService";
import { Node } from "../Node";

export function CreateAddRotationZ() {
	return AddNode(new AddRotationZAPI(), (data: NodeData) => {
		return <AddRotationZ key={`node_${data.node.id}`} data={data} />;
	});
}

function AddRotationZ({ data }: { data: NodeData }) {
	return (
		<Node Name="Add Rotation Z" Id={data.node.id} AnchorPoint={data.anchorPoint}>
			<NumberField
				NodeId={data.node.id}
				NodeField={(data.node as AddRotationZAPI).nodeFields.rotation}
				NodeFieldName={AddRotationZFieldNames.rotation}
				Label={CapitalizeFirstLetter(AddRotationZFieldNames.rotation)}
			/>
		</Node>
	);
}
