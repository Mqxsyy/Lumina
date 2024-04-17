import Roact from "@rbxts/roact";
import { SetColorOverLife as ColorOverLifeAPI } from "API/Nodes/Update/SetColorOverLife";
import { ColorRampField } from "Components/NodeFields/ColorRampField";
import { AddNode, NodeData } from "Services/NodesService";
import { Node } from "../Node";

export function CreateSetColorOverLife() {
	return AddNode(new ColorOverLifeAPI(), (data: NodeData) => {
		return <SetColorOverLife data={data} />;
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
