import Roact, { useRef } from "@rbxts/roact";
import { Event } from "API/Bindables/Event";
import { SetSize as SetSizeAPI } from "API/Nodes/Initialize/SetSize";
import ConnectionPointIn from "Components/Connections/ConnectionPointIn";
import Div from "Components/Div";
import { NumberField } from "Components/NodeFields/NumberField";
import { AddNode, GetNextNodeId, NodeData } from "Services/NodesService";
import { GetMousePositionOnCanvas } from "Windows/MainWindow";
import { Node } from "../Node";

export function CreateSetSize() {
	return AddNode({
		data: {
			id: GetNextNodeId(),
			anchorPoint: GetMousePositionOnCanvas(),
			node: new SetSizeAPI(),
			elementLoaded: new Event(),
		},
		create: (data: NodeData) => {
			return <SetSize key={data.id} data={data} />;
		},
	});
}

function SetSize({ data }: { data: NodeData }) {
	const sizeFieldRef = useRef((data.node as SetSizeAPI).nodeFields.size);

	return (
		<Node Name="Set Size" Id={data.id} AnchorPoint={data.anchorPoint}>
			<uipadding PaddingLeft={new UDim(0, 10)} />

			<Div Size={UDim2.fromScale(1, 0)} AutomaticSize="Y">
				<uilistlayout FillDirection="Horizontal" Padding={new UDim(0, 5)} />

				<ConnectionPointIn Size={UDim2.fromOffset(20, 20)} BindFunction={sizeFieldRef.current.BindNumber} />
				<NumberField
					Size={new UDim2(1, -25, 0, 0)}
					Label={"Size"}
					DefaultText={tostring(sizeFieldRef.current!.GetNumber())}
					TextToInputRatio={0.25}
					Disabled={sizeFieldRef.current!.boundNode !== undefined}
					NumberChanged={sizeFieldRef.current.SetNumber}
				/>
			</Div>
		</Node>
	);
}
