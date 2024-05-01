import Roact from "@rbxts/roact";
import { NodeSystem as NodeSystemAPI } from "API/NodeSystem";
import { AddSystem } from "Services/NodeSystemService";
import NodeSystem from "./NodeSystem";
import { GetCanvasData } from "Services/CanvasService";

export function CreateEmptySystem(position?: Vector2) {
	return AddSystem(
		new NodeSystemAPI(),
		(systemData) => (
			<NodeSystem
				key={`system_${systemData.id}`}
				anchorPoint={systemData.anchorPoint}
				canvasPosition={GetCanvasData().Position}
				systemId={systemData.id}
				systemAPI={systemData.system}
				systemDestroyEvent={systemData.onDestroy}
			/>
		),
		position,
	);
}
