import Roact, { useRef } from "@rbxts/roact";
import { SetTransparencyOverLife as TransparencyOverLifeAPI } from "API/Nodes/Update/SetTransparencyOverLife";
import { LineGraphField } from "Components/NodeFields/LineGraphField";
import { AddNode, NodeData } from "Services/NodesService";
import { Node } from "../Node";

export function CreateSetTransparencyOverLife() {
	return AddNode(new TransparencyOverLifeAPI(), (data: NodeData) => {
		return <SetTransparencyOverLife data={data} />;
	});
}

function SetTransparencyOverLife({ data }: { data: NodeData }) {
	const graphFieldRef = useRef((data.node as TransparencyOverLifeAPI).nodeFields.graph);

	return (
		<Node Name="Set Transparency Over Life" Id={data.id} AnchorPoint={data.anchorPoint}>
			<uipadding PaddingLeft={new UDim(0, 10)} />
			<LineGraphField Label={"Graph"} Graph={graphFieldRef.current} />
		</Node>
	);
}
