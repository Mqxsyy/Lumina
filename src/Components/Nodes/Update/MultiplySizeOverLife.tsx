import Roact, { useRef } from "@rbxts/roact";
import { MultiplySizeOverLife as MultiplySizeOverLifeAPI } from "API/Nodes/Update/MultiplySizeOverLife";
import { LineGraphField } from "Components/NodeFields/LineGraphField";
import { AddNode, NodeData } from "Services/NodesService";
import { Node } from "../Node";

export function CreateMultiplySizeOverLife() {
	return AddNode(new MultiplySizeOverLifeAPI(), (data: NodeData) => {
		return <MultiplySizeOverLife key={`node_${data.node.id}`} data={data} />;
	});
}

function MultiplySizeOverLife({ data }: { data: NodeData }) {
	const graphFieldRef = useRef((data.node as MultiplySizeOverLifeAPI).nodeFields.graph);

	return (
		<Node Name="Multiple Size Over Life" Id={data.node.id} AnchorPoint={data.anchorPoint}>
			<LineGraphField Label={"Graph"} Graph={graphFieldRef.current} MaxValue={10} />
		</Node>
	);
}
