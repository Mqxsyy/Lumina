import Roact from "@rbxts/roact";
import { AddNodeSystem, GetNextNodeSystemId } from "Components/Services/NodeSystemService";
import { GetMousePositionOnCanvas } from "WidgetHandler";
import { NodeSystem } from "./NodeSystem";
import { NodeSystem as NodeSystemAPI } from "API/Systems/NodeSystem";

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
