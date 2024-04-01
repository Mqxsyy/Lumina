import Roact from "@rbxts/roact";
import { Node } from "../Node";
import { AddNode, GetNextNodeId, NodeData } from "Services/NodesService";
import { MultiplySizeOverLife as MultiplySizeOverLifeAPI } from "API/Nodes/Update/MultiplySizeOverLife";
import { Event } from "API/Bindables/Event";
import { LineGraphField } from "Components/NodeFields/LineGraphField";
import { GetMousePositionOnCanvas } from "Windows/MainWindow";

export function CreateMultiplySizeOverLife() {
	AddNode({
		data: {
			id: GetNextNodeId(),
			anchorPoint: GetMousePositionOnCanvas(),
			node: new MultiplySizeOverLifeAPI(),
			elementLoaded: new Event(),
		},
		create: (data: NodeData) => {
			return <MultiplySizeOverLife key={data.id} data={data} />;
		},
	});
}

function MultiplySizeOverLife({ data }: { data: NodeData }) {
	return (
		<Node Name="Multiple Size Over Life" Id={data.id} AnchorPoint={data.anchorPoint}>
			<uipadding PaddingLeft={new UDim(0, 10)} />
			<LineGraphField Label={"Graph"} Graph={(data.node as MultiplySizeOverLifeAPI).graph} MaxValue={10} />
		</Node>
	);
}
