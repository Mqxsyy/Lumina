import Roact from "@rbxts/roact";
import { SetColor as SetColorAPI } from "API/Nodes/Initialize/SetColor";
import { ColorPickerField } from "Components/NodeFields/ColorPickerField";
import { AddNode, NodeData } from "Services/NodesService";
import { Node } from "../Node";

export function CreateSetColor() {
	return AddNode(new SetColorAPI(), (data: NodeData) => {
		return <SetColor key={data.id} data={data} />;
	});
}

function SetColor({ data }: { data: NodeData }) {
	return (
		<Node Name="Set Color" Id={data.id} AnchorPoint={data.anchorPoint}>
			<ColorPickerField Label="Color" ColorPicker={(data.node as SetColorAPI).nodeFields.color} />
		</Node>
	);
}
