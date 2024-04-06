import Roact, { useRef } from "@rbxts/roact";
import { Event } from "API/Bindables/Event";
import { AddRotationZ as AddRotationZAPI } from "API/Nodes/Update/AddRotationZ";
import ConnectionPointIn from "Components/Connections/ConnectionPointIn";
import { NumberField } from "Components/NodeFields/NumberField";
import { AddNode, GetNextNodeId, NodeData } from "Services/NodesService";
import { GetMousePositionOnCanvas } from "Windows/MainWindow";
import { Node } from "../Node";
import Div from "Components/Div";

export function CreateAddRotationZ() {
	AddNode({
		data: {
			id: GetNextNodeId(),
			anchorPoint: GetMousePositionOnCanvas(),
			node: new AddRotationZAPI(),
			elementLoaded: new Event(),
		},
		create: (data: NodeData) => {
			return <AddRotationZ key={data.id} data={data} />;
		},
	});
}

function AddRotationZ({ data }: { data: NodeData }) {
	const rotationFieldRef = useRef((data.node as AddRotationZAPI).nodeFields.rotation);

	return (
		<Node Name="Add Rotation Z" Id={data.id} AnchorPoint={data.anchorPoint}>
			<uipadding PaddingLeft={new UDim(0, 10)} />

			<Div Size={UDim2.fromScale(1, 0)} AutomaticSize="Y">
				<uilistlayout FillDirection="Horizontal" Padding={new UDim(0, 5)} />

				<ConnectionPointIn Size={UDim2.fromOffset(20, 20)} BindFunction={rotationFieldRef.current.BindNumber} />
				<NumberField
					Size={new UDim2(1, -25, 0, 0)}
					Label={"Rotation"}
					DefaultText={tostring(rotationFieldRef.current.GetNumber())}
					NumberChanged={rotationFieldRef.current.SetNumber}
					Disabled={rotationFieldRef.current.boundNode !== undefined}
				/>
			</Div>
		</Node>
	);
}
