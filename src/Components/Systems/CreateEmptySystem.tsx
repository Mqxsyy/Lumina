import Roact from "@rbxts/roact";
import { NodeSystem as NodeSystemAPI } from "API/NodeSystem";
import { AddSystem } from "Services/NodeSystemService";
import NodeSystem from "./NodeSystem";

export function CreateEmptySystem(position?: Vector2) {
	return AddSystem(
		new NodeSystemAPI(),
		(systemData) => <NodeSystem key={`system_${systemData.id}`} data={systemData} />,
		position,
	);
}
