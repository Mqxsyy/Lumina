import Roact from "@rbxts/roact";
import { Node } from "../Node";
import { AddNode, GetNextNodeId, NodeData } from "Services/NodesService";
import { SetSizeOverLife as SizeOverLifeAPI } from "API/Nodes/Update/SetSizeOverLife";
import { Event } from "API/Bindables/Event";
import { LineGraphField } from "Components/NodeFields/LineGraphField";
import { GetMousePositionOnCanvas } from "Windows/MainWindow";

export function CreateSetSizeOverLife() {
	AddNode({
		data: {
			id: GetNextNodeId(),
			anchorPoint: GetMousePositionOnCanvas(),
			node: new SizeOverLifeAPI(),
			elementLoaded: new Event(),
		},
		create: (data: NodeData) => {
			return <SetSizeOverLife key={data.id} data={data} />;
		},
	});
}

function SetSizeOverLife({ data }: { data: NodeData }) {
	return (
		<Node Name="Set Size Over Life" Id={data.id} AnchorPoint={data.anchorPoint}>
			<uipadding PaddingLeft={new UDim(0, 10)} />
			<LineGraphField Label={"Graph"} Graph={(data.node as SizeOverLifeAPI).graph} MaxValue={10} />
		</Node>
	);
}
