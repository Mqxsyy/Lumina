import Roact, { useRef } from "@rbxts/roact";
import { Event } from "API/Bindables/Event";
import { SetSizeRandom as SetSizeRandomAPI } from "API/Nodes/Initialize/SetSizeRandom";
import Div from "Components/Div";
import { Vector2Field } from "Components/NodeFields/Vector2Field";
import { AddNode, GetNextNodeId, NodeData } from "Services/NodesService";
import { GetMousePositionOnCanvas } from "Windows/MainWindow";
import { Node } from "../Node";

export function CreateSetSizeRandom() {
	return AddNode({
		data: {
			id: GetNextNodeId(),
			anchorPoint: GetMousePositionOnCanvas(),
			node: new SetSizeRandomAPI(),
			elementLoaded: new Event(),
		},
		create: (data: NodeData) => {
			return <SetSizeRandom key={data.id} data={data} />;
		},
	});
}

function SetSizeRandom({ data }: { data: NodeData }) {
	const rangeFieldRef = useRef((data.node as SetSizeRandomAPI).nodeFields.range);

	const rangeChanged = (newRange: Vector2) => {
		rangeFieldRef.current.SetValue(newRange);
	};

	return (
		<Node Name="Set Size Random" Id={data.id} AnchorPoint={data.anchorPoint}>
			<uipadding PaddingLeft={new UDim(0, 10)} />

			<Div Size={UDim2.fromScale(1, 0)} AutomaticSize="Y">
				<uilistlayout FillDirection="Horizontal" Padding={new UDim(0, 5)} />

				<Vector2Field
					Label={"Range"}
					DefaultValue={rangeFieldRef.current.GetValue()}
					Vector2Changed={rangeChanged}
				/>
			</Div>
		</Node>
	);
}
