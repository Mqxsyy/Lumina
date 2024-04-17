import Roact, { useRef } from "@rbxts/roact";
import { MultiplySizeOverLife as MultiplySizeOverLifeAPI } from "API/Nodes/Update/MultiplySizeOverLife";
import { LineGraphField } from "Components/NodeFields/LineGraphField";
import { AddNode, NodeData } from "Services/NodesService";
import { Node } from "../Node";

export function CreateMultiplySizeOverLife() {
	return AddNode(new MultiplySizeOverLifeAPI(), (data: NodeData) => {
		return <MultiplySizeOverLife data={data} />;
	});
}

function MultiplySizeOverLife({ data }: { data: NodeData }) {
	const graphFieldRef = useRef((data.node as MultiplySizeOverLifeAPI).nodeFields.graph);

	return (
		<Node Name="Multiple Size Over Life" Id={data.id} AnchorPoint={data.anchorPoint}>
			<uipadding PaddingLeft={new UDim(0, 10)} />
			<LineGraphField Label={"Graph"} Graph={graphFieldRef.current} MaxValue={10} />
		</Node>
	);
}
