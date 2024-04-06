import Roact, { useRef } from "@rbxts/roact";
import { Event } from "API/Bindables/Event";
import { Drag as DragAPI } from "API/Nodes/Update/Drag";
import ConnectionPointIn from "Components/Connections/ConnectionPointIn";
import { NumberField } from "Components/NodeFields/NumberField";
import { AddNode, GetNextNodeId, NodeData } from "Services/NodesService";
import { GetMousePositionOnCanvas } from "Windows/MainWindow";
import { Node } from "../Node";
import Div from "Components/Div";

export function CreateDrag() {
	AddNode({
		data: {
			id: GetNextNodeId(),
			anchorPoint: GetMousePositionOnCanvas(),
			node: new DragAPI(),
			elementLoaded: new Event(),
		},
		create: (data: NodeData) => {
			return <Drag key={data.id} data={data} />;
		},
	});
}

function Drag({ data }: { data: NodeData }) {
	const dragFieldRef = useRef((data.node as DragAPI).nodeFields.drag);

	return (
		<Node Name="Drag" Id={data.id} AnchorPoint={data.anchorPoint}>
			<uipadding PaddingLeft={new UDim(0, 10)} />

			<Div Size={UDim2.fromScale(1, 0)} AutomaticSize="Y">
				<uilistlayout FillDirection="Horizontal" Padding={new UDim(0, 5)} />

				<ConnectionPointIn Size={UDim2.fromOffset(20, 20)} BindFunction={dragFieldRef.current.BindNumber} />
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
