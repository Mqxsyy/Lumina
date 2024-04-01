import Roact from "@rbxts/roact";
import { Node } from "../Node";
import { AddNode, GetNextNodeId, NodeData } from "Services/NodesService";
import { SetTransparencyOverLife as TransparencyOverLifeAPI } from "API/Nodes/Update/SetTransparencyOverLife";
import { Event } from "API/Bindables/Event";
import { LineGraphField } from "Components/NodeFields/LineGraphField";
import { GetMousePositionOnCanvas } from "Windows/MainWindow";

export function CreateSetTransparencyOverLife() {
	AddNode({
		data: {
			id: GetNextNodeId(),
			anchorPoint: GetMousePositionOnCanvas(),
			node: new TransparencyOverLifeAPI(),
			elementLoaded: new Event(),
		},
		create: (data: NodeData) => {
			return <SetTransparencyOverLife key={data.id} data={data} />;
		},
	});
}

function SetTransparencyOverLife({ data }: { data: NodeData }) {
	return (
		<Node Name="Set Transparency Over Life" Id={data.id} AnchorPoint={data.anchorPoint}>
			<uipadding PaddingLeft={new UDim(0, 10)} />
			<LineGraphField Label={"Graph"} Graph={(data.node as TransparencyOverLifeAPI).graph} />
		</Node>
	);
}
