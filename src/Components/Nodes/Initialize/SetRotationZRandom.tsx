import Roact, { useRef } from "@rbxts/roact";
import { SetRotationZRandom as SetRotationZRandomAPI } from "API/Nodes/Initialize/SetRotationZRandom";
import Div from "Components/Div";
import { Vector2Field } from "Components/NodeFields/Vector2Field";
import { AddNode, NodeData } from "Services/NodesService";
import { Node } from "../Node";

export function CreateRotationZRandom() {
	return AddNode(new SetRotationZRandomAPI(), (data: NodeData) => {
		return <SetRotationZRandom data={data} />;
	});
}

function SetRotationZRandom({ data }: { data: NodeData }) {
	const rangeFieldRef = useRef((data.node as SetRotationZRandomAPI).nodeFields.range);

	return (
		<Node Name="Set Rotation Z Random" Id={data.id} AnchorPoint={data.anchorPoint}>
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
