import Roact from "@rbxts/roact";
import { Node } from "../Node";
import { BasicTextLabel } from "Components/Basic/BasicTextLabel";
import { AddNode, GetNextNodeId, NodeData } from "Services/NodesService";
import { GetMousePositionOnCanvas } from "WidgetHandler";
import { StaticForce as StaticForceAPI } from "API/Nodes/Update/StaticForce";

export function CreateStaticForceNode() {
	AddNode({
		data: {
			id: GetNextNodeId(),
			anchorPoint: GetMousePositionOnCanvas(),
			node: new StaticForceAPI(),
		},
		create: (data: NodeData) => {
			return <StaticForce key={data.id} data={data} />;
		},
	});
}
function StaticForce({ data }: { data: NodeData }) {
	return (
		<Node Name="Static Force" Id={data.id} AnchorPoint={data.anchorPoint}>
			<BasicTextLabel Size={new UDim2(1, 0, 0, 20)} Text={"Position"} />
			<BasicTextLabel Size={new UDim2(1, 0, 0, 20)} Text={"IsLocal"} />
			<BasicTextLabel Size={new UDim2(1, 0, 0, 20)} Text={"StoreValue"} />
		</Node>
	);
}
