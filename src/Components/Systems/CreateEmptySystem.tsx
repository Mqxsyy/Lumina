import Roact from "@rbxts/roact";
import { AddNodeSystem, GetNextNodeSystemId } from "Services/NodeSystemService";
import { GetMousePositionOnCanvas } from "WidgetHandler";
import { NodeSystem as NodeSystemAPI } from "API/NodeSystem";
import { NodeSystem } from "./NodeSystem";

export function CreateEmptySystem() {
	AddNodeSystem({
		data: {
			id: GetNextNodeSystemId(),
			anchorPoint: GetMousePositionOnCanvas(),
			system: new NodeSystemAPI(),
		},
		create: (data) => <NodeSystem key={data.id} data={data} />,
	});
}
