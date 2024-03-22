import Roact from "@rbxts/roact";
import { Node } from "../Node";
import { BasicTextLabel } from "Components/Basic/BasicTextLabel";
import { AddNode, GetNextNodeId, NodeData } from "Services/NodesService";
import { GetMousePositionOnCanvas } from "Windows/MainWindow";
import { StaticForce as StaticForceAPI } from "API/Nodes/Update/StaticForce";
import { Event } from "API/Bindables/Event";
import { Vector3Field } from "Components/NodeFields/Vector3Field";

export function CreateStaticForceNode() {
	AddNode({
		data: {
			id: GetNextNodeId(),
			anchorPoint: GetMousePositionOnCanvas(),
			node: new StaticForceAPI(),
			elementLoaded: new Event(),
		},
		create: (data: NodeData) => {
			return <StaticForce key={data.id} data={data} />;
		},
	});
}

function StaticForce({ data }: { data: NodeData }) {
	return (
		<Node Name="Static Force" Id={data.id} AnchorPoint={data.anchorPoint}>
			<uipadding PaddingLeft={new UDim(0, 10)} />

			<Vector3Field
				NodeField={(data.node as StaticForceAPI).nodeFields.direction}
				Label={"Vector3"}
				DefaultValue={new Vector3(0, 1, 0)}
			/>

			<BasicTextLabel Size={new UDim2(1, 0, 0, 20)} Text={"IsLocal"} />
			<BasicTextLabel Size={new UDim2(1, 0, 0, 20)} Text={"StoreValue"} />
		</Node>
	);
}
