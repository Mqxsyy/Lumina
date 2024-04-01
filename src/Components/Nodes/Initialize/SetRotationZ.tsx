import Roact, { useRef } from "@rbxts/roact";
import { Event } from "API/Bindables/Event";
import { SetRotationZ as SetRotationZAPI } from "API/Nodes/Initialize/SetRotationZ";
import ConnectionPointIn from "Components/Connections/ConnectionPointIn";
import Div from "Components/Div";
import { NumberField } from "Components/NodeFields/NumberField";
import { AddNode, GetNextNodeId, NodeData } from "Services/NodesService";
import { GetMousePositionOnCanvas } from "Windows/MainWindow";
import { Node } from "../Node";

export function CreateSetRotationZ() {
	return AddNode({
		data: {
			id: GetNextNodeId(),
			anchorPoint: GetMousePositionOnCanvas(),
			node: new SetRotationZAPI(),
			elementLoaded: new Event(),
		},
		create: (data: NodeData) => {
			return <SetRotationZ key={data.id} data={data} />;
		},
	});
}

function SetRotationZ({ data }: { data: NodeData }) {
	const rotationFieldRef = useRef((data.node as SetRotationZAPI).nodeFields.rotation);

	const timeChanged = (number: number) => {
		rotationFieldRef.current.SetValue(number);
	};

	return (
		<Node Name="Set Rotation Z" Id={data.id} AnchorPoint={data.anchorPoint}>
			<uipadding PaddingLeft={new UDim(0, 10)} />

			<Div Size={UDim2.fromScale(1, 0)} AutomaticSize="Y">
				<uilistlayout FillDirection="Horizontal" Padding={new UDim(0, 5)} />

				<ConnectionPointIn Size={UDim2.fromOffset(20, 20)} BindFunction={rotationFieldRef.current.BindValue} />
				<NumberField
					Size={new UDim2(1, -25, 0, 0)}
					Label={"Rotation"}
					DefaultText={tostring(rotationFieldRef.current.GetValue())}
					TextToInputRatio={0.25}
					Disabled={rotationFieldRef.current.valueBindNode !== undefined}
					NumberChanged={timeChanged}
				/>
			</Div>
		</Node>
	);
}
