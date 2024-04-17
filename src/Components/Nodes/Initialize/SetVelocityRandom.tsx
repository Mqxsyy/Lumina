import Roact, { useRef } from "@rbxts/roact";
import { SetVelocityRandom as SetVelocityRandomAPI } from "API/Nodes/Initialize/SetVelocityRandom";
import { Vector2Field } from "Components/NodeFields/Vector2Field";
import { AddNode, NodeData } from "Services/NodesService";
import { Node } from "../Node";

export function CreateSetVelocityRandom() {
	return AddNode(new SetVelocityRandomAPI(), (data: NodeData) => {
		return <SetVelocityRandom data={data} />;
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
