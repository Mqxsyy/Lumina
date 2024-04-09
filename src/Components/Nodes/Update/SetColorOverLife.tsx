import Roact from "@rbxts/roact";
import { Node } from "../Node";
import { AddNode, GetNextNodeId, NodeData } from "Services/NodesService";
import { SetColorOverLife as ColorOverLifeAPI } from "API/Nodes/Update/SetColorOverLife";
import { Event } from "API/Bindables/Event";
import { GetMousePositionOnCanvas } from "Windows/MainWindow";
import { ColorRampField } from "Components/NodeFields/ColorRampField";

export function CreateSetColorOverLife() {
	return AddNode({
		data: {
			id: GetNextNodeId(),
			anchorPoint: GetMousePositionOnCanvas(),
			node: new ColorOverLifeAPI(),
			elementLoaded: new Event(),
		},
		create: (data: NodeData) => {
			return <SetColorOverLife key={data.id} data={data} />;
		},
	});
}

function SetColorOverLife({ data }: { data: NodeData }) {
	return (
		<Node Name="Set Color Over Life" Id={data.id} AnchorPoint={data.anchorPoint}>
			<uipadding PaddingLeft={new UDim(0, 10)} />
			<ColorRampField Label={"Ramp"} Ramp={(data.node as ColorOverLifeAPI).nodeFields.ramp} />
		</Node>
	);
}
