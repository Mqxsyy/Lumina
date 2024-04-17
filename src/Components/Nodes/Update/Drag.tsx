import Roact, { useRef } from "@rbxts/roact";
import { Drag as DragAPI, DragFieldNames } from "API/Nodes/Update/Drag";
import NumberFieldConnectionIn from "Components/NodeFields/NumberFieldConnectionIn";
import { AddNode, NodeData } from "Services/NodesService";
import { Node } from "../Node";

export function CreateDrag() {
	return AddNode(new DragAPI(), (data: NodeData) => {
		return <Drag data={data} />;
	});
}

function Drag({ data }: { data: NodeData }) {
	const dragFieldRef = useRef((data.node as DragAPI).nodeFields.drag);

	return (
		<Node Name="Drag" Id={data.id} AnchorPoint={data.anchorPoint}>
			<NumberFieldConnectionIn
				NodeId={data.id}
				NodeFieldName={DragFieldNames.drag}
				NodeAbsolutePosition={data.anchorPoint}
				DefaultText={tostring(dragFieldRef.current.GetNumber())}
				InputDisabled={dragFieldRef.current.boundNode !== undefined}
				NumberChanged={dragFieldRef.current.SetNumber}
				BindFunction={dragFieldRef.current.BindNumber}
				UnbindFunction={dragFieldRef.current.UnbindNumber}
			/>
		</Node>
	);
}
