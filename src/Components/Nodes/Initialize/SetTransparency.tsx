import Roact, { useRef } from "@rbxts/roact";
import { SetTransparency as SetTransparencyAPI, SetTransparencyFieldNames } from "API/Nodes/Initialize/SetTransparency";
import NumberFieldConnectionIn from "Components/NodeFields/NumberFieldConnectionIn";
import { AddNode, NodeData } from "Services/NodesService";
import { Node } from "../Node";

export function CreateSetTransparency() {
	return AddNode(new SetTransparencyAPI(), (data: NodeData) => {
		return <SetTransparency key={`node_${data.node.id}`} data={data} />;
	});
}

function SetTransparency({ data }: { data: NodeData }) {
	const transparencyFieldRef = useRef((data.node as SetTransparencyAPI).nodeFields.transparency);

	return (
		<Node Name="Set Transparency" Id={data.node.id} AnchorPoint={data.anchorPoint}>
			<NumberFieldConnectionIn
				NodeId={data.node.id}
				NodeFieldName={SetTransparencyFieldNames.transparency}
				NodeAbsolutePosition={data.anchorPoint}
				DefaultText={tostring(transparencyFieldRef.current.GetNumber())}
				InputDisabled={transparencyFieldRef.current.boundNode !== undefined}
				NumberChanged={transparencyFieldRef.current.SetNumber}
				BindFunction={transparencyFieldRef.current.BindNumber}
				UnbindFunction={transparencyFieldRef.current.UnbindNumber}
			/>
		</Node>
	);
}
