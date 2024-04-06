import Roact, { useRef } from "@rbxts/roact";
import { Event } from "API/Bindables/Event";
import { SetVelocityRandom as SetVelocityRandomAPI } from "API/Nodes/Initialize/SetVelocityRandom";
import { Vector2Field } from "Components/NodeFields/Vector2Field";
import { AddNode, GetNextNodeId, NodeData } from "Services/NodesService";
import { GetMousePositionOnCanvas } from "Windows/MainWindow";
import { Node } from "../Node";

export function CreateSetVelocityRandom() {
	return AddNode({
		data: {
			id: GetNextNodeId(),
			anchorPoint: GetMousePositionOnCanvas(),
			node: new SetVelocityRandomAPI(),
			elementLoaded: new Event(),
		},
		create: (data: NodeData) => {
			return <SetVelocityRandom key={data.id} data={data} />;
		},
	});
}

function SetVelocityRandom({ data }: { data: NodeData }) {
	const rangeXRef = useRef((data.node as SetVelocityRandomAPI).nodeFields.rangeX);
	const rangeYRef = useRef((data.node as SetVelocityRandomAPI).nodeFields.rangeY);
	const rangeZRef = useRef((data.node as SetVelocityRandomAPI).nodeFields.rangeZ);

	return (
		<Node Name="Set Velocity Random" Id={data.id} AnchorPoint={data.anchorPoint}>
			<uipadding PaddingLeft={new UDim(0, 10)} />

			<Vector2Field
				Label={"X"}
				ValueLabels={["Min", "Max"]}
				DefaultValues={rangeXRef.current.GetVector2()}
				Vector2Changed={rangeXRef.current.SetVector2}
			/>
			<Vector2Field
				Label={"Y"}
				ValueLabels={["Min", "Max"]}
				DefaultValues={rangeYRef.current.GetVector2()}
				Vector2Changed={rangeYRef.current.SetVector2}
			/>
			<Vector2Field
				Label={"Z"}
				ValueLabels={["Min", "Max"]}
				DefaultValues={rangeZRef.current.GetVector2()}
				Vector2Changed={rangeZRef.current.SetVector2}
			/>
		</Node>
	);
}
