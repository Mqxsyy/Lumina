import Roact, { useRef } from "@rbxts/roact";
import { SetSize as SetSizeAPI, SetSizeFieldNames } from "API/Nodes/Initialize/SetSize";
import NumberFieldConnectionIn from "Components/NodeFields/NumberFieldConnectionIn";
import { AddNode, NodeData } from "Services/NodesService";
import { Node } from "../Node";

export function CreateSetSize() {
	return AddNode(new SetSizeAPI(), (data: NodeData) => {
		return <SetSize key={`node_${data.node.id}`} data={data} />;
	});
}

function SetSize({ data }: { data: NodeData }) {
	const sizeFieldRef = useRef((data.node as SetSizeAPI).nodeFields.size);

	return (
		<Node Name="Set Size" Id={data.node.id} AnchorPoint={data.anchorPoint}>
			<NumberFieldConnectionIn
				NodeId={data.node.id}
				NodeFieldName={SetSizeFieldNames.size}
				NodeAbsolutePosition={data.anchorPoint}
				DefaultText={tostring(sizeFieldRef.current.GetNumber())}
				InputDisabled={sizeFieldRef.current.boundNode !== undefined}
				NumberChanged={sizeFieldRef.current.SetNumber}
				BindFunction={sizeFieldRef.current.BindNumber}
				UnbindFunction={sizeFieldRef.current.UnbindNumber}
			/>
		</Node>
	);
}
