import Roact, { useRef } from "@rbxts/roact";
import { SetSizeOverLife as SizeOverLifeAPI } from "API/Nodes/Update/SetSizeOverLife";
import { LineGraphField } from "Components/NodeFields/LineGraphField";
import { AddNode, NodeData } from "Services/NodesService";
import { Node } from "../Node";

export function CreateSetSizeOverLife() {
	return AddNode(new SizeOverLifeAPI(), (data: NodeData) => {
		return <SetSizeOverLife data={data} />;
	});
}

function SetSizeOverLife({ data }: { data: NodeData }) {
	const graphFieldRef = useRef((data.node as SizeOverLifeAPI).nodeFields.graph);

	return (
		<Node Name="Set Size Over Life" Id={data.id} AnchorPoint={data.anchorPoint}>
			<LineGraphField Label={"Graph"} Graph={graphFieldRef.current} MaxValue={10} />
		</Node>
	);
}
