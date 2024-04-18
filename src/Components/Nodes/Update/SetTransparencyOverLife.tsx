import Roact, { useRef } from "@rbxts/roact";
import { SetTransparencyOverLife as TransparencyOverLifeAPI } from "API/Nodes/Update/SetTransparencyOverLife";
import { LineGraphField } from "Components/NodeFields/LineGraphField";
import { AddNode, NodeData } from "Services/NodesService";
import { Node } from "../Node";

export function CreateSetTransparencyOverLife() {
	return AddNode(new TransparencyOverLifeAPI(), (data: NodeData) => {
		return <SetTransparencyOverLife key={`node_${data.node.id}`} data={data} />;
	});
}

function SetTransparencyOverLife({ data }: { data: NodeData }) {
	const graphFieldRef = useRef((data.node as TransparencyOverLifeAPI).nodeFields.graph);

	return (
		<Node Name="Set Transparency Over Life" Id={data.node.id} AnchorPoint={data.anchorPoint}>
			<LineGraphField Label={"Graph"} Graph={graphFieldRef.current} />
		</Node>
	);
}
