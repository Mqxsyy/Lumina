import Roact, { useRef } from "@rbxts/roact";
import { Drag as DragAPI, DragFieldNames } from "API/Nodes/Update/Drag";
import ConnectionPointIn from "Components/Connections/ConnectionPointIn";
import Div from "Components/Div";
import { NumberField } from "Components/NodeFields/NumberField";
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
			<uipadding PaddingLeft={new UDim(0, 10)} />

			<Div Size={UDim2.fromScale(1, 0)} AutomaticSize="Y">
				<uilistlayout FillDirection="Horizontal" Padding={new UDim(0, 5)} />

				<ConnectionPointIn
					Size={UDim2.fromOffset(20, 20)}
					NodeId={data.id}
					NodeFieldName={DragFieldNames.drag}
					NodeAbsolutePosition={data.anchorPoint}
					BindFunction={dragFieldRef.current.BindNumber}
					UnbindFunction={dragFieldRef.current.UnbindNumber}
				/>
				<NumberField
					Size={new UDim2(1, -25, 0, 0)}
					Label={"Value"}
					DefaultText={tostring(dragFieldRef.current.GetNumber())}
					NumberChanged={dragFieldRef.current.SetNumber}
					Disabled={dragFieldRef.current.boundNode !== undefined}
				/>
			</Div>
		</Node>
	);
}
