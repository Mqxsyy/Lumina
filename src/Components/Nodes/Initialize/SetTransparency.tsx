import Roact, { useRef } from "@rbxts/roact";
import { Event } from "API/Bindables/Event";
import { SetTransparency as SetTransparencyAPI } from "API/Nodes/Initialize/SetTransparency";
import ConnectionPointIn from "Components/Connections/ConnectionPointIn";
import Div from "Components/Div";
import { NumberField } from "Components/NodeFields/NumberField";
import { AddNode, GetNextNodeId, NodeData } from "Services/NodesService";
import { GetMousePositionOnCanvas } from "Windows/MainWindow";
import { Node } from "../Node";

export function CreateSetTransparency() {
	return AddNode({
		data: {
			id: GetNextNodeId(),
			anchorPoint: GetMousePositionOnCanvas(),
			node: new SetTransparencyAPI(),
			elementLoaded: new Event(),
		},
		create: (data: NodeData) => {
			return <SetTransparency key={data.id} data={data} />;
		},
	});
}

function SetTransparency({ data }: { data: NodeData }) {
	const transparencyFieldRef = useRef((data.node as SetTransparencyAPI).nodeFields.transparency);

	return (
		<Node Name="Set Transparency" Id={data.id} AnchorPoint={data.anchorPoint}>
			<uipadding PaddingLeft={new UDim(0, 10)} />

			<Div Size={UDim2.fromScale(1, 0)} AutomaticSize="Y">
				<uilistlayout FillDirection="Horizontal" Padding={new UDim(0, 5)} />

				<ConnectionPointIn
					Size={UDim2.fromOffset(20, 20)}
					BindFunction={transparencyFieldRef.current.BindNumber}
				/>
				<NumberField
					Size={new UDim2(1, -25, 0, 0)}
					Label={"Value"}
					DefaultText={tostring(transparencyFieldRef.current.GetNumber())}
					TextToInputRatio={0.25}
					Disabled={transparencyFieldRef.current.boundNode !== undefined}
					NumberChanged={transparencyFieldRef.current.SetNumber}
				/>
			</Div>
		</Node>
	);
}
