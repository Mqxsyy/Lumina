import Roact from "@rbxts/roact";
import { Node } from "../Node";
import { BasicTextLabel } from "Components/Basic/BasicTextLabel";
import { AddNode, GetNextNodeId, NodeData } from "Services/NodesService";
import { GetMousePositionOnCanvas } from "WidgetHandler";
import { Lifetime as LifetimeAPI } from "API/Nodes/Initialize/Lifetime";

export function CreateLifetimeNode() {
	AddNode({
		data: {
			id: GetNextNodeId(),
			anchorPoint: GetMousePositionOnCanvas(),
			node: new LifetimeAPI(),
		},
		create: (data: NodeData) => {
			return <Lifetime key={data.id} data={data} />;
		},
	});
}

function Lifetime({ data }: { data: NodeData }) {
	return (
		<Node Name="Lifetime" Id={data.id} AnchorPoint={data.anchorPoint}>
			<BasicTextLabel Size={new UDim2(1, 0, 0, 20)} Text={"Time"} />
		</Node>
	);
}
