import Roact, { useRef } from "@rbxts/roact";
import { Event } from "API/Bindables/Event";
import { SetLifetimeRandom as SetLifetimeRandomAPI } from "API/Nodes/Initialize/SetLifetimeRandom";
import Div from "Components/Div";
import { Vector2Field } from "Components/NodeFields/Vector2Field";
import { AddNode, GetNextNodeId, NodeData } from "Services/NodesService";
import { GetMousePositionOnCanvas } from "Windows/MainWindow";
import { Node } from "../Node";

export function CreateSetLifetimeRandom() {
	return AddNode({
		data: {
			id: GetNextNodeId(),
			anchorPoint: GetMousePositionOnCanvas(),
			node: new SetLifetimeRandomAPI(),
			elementLoaded: new Event(),
		},
		create: (data: NodeData) => {
			return <SetLifetimeRandom key={data.id} data={data} />;
		},
	});
}

function SetLifetimeRandom({ data }: { data: NodeData }) {
	const rangeFieldRef = useRef((data.node as SetLifetimeRandomAPI).nodeFields.range);

	return (
		<Node Name="Set Lifetime Random" Id={data.id} AnchorPoint={data.anchorPoint}>
			<uipadding PaddingLeft={new UDim(0, 10)} />

			<Div Size={UDim2.fromScale(1, 0)} AutomaticSize="Y">
				<uilistlayout FillDirection="Horizontal" Padding={new UDim(0, 5)} />

				<Vector2Field
					Label={"Range"}
					ValueLabels={["Min", "Max"]}
					DefaultValues={rangeFieldRef.current.GetVector2()}
					Vector2Changed={rangeFieldRef.current.SetVector2}
				/>
			</Div>
		</Node>
	);
}
