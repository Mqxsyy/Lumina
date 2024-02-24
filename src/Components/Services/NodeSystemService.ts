import Roact from "@rbxts/roact";
import { Event } from "API/Event";
import { IdPool } from "API/IdPool";
import { NodeSystem } from "API/Systems/NodeSystem";
import { GetMousePositionOnCanvas } from "WidgetHandler";

// TODO: Add render order changing

export interface NodeSystemData {
	id: number;
	anchorPoint: Vector2;
	system: NodeSystem;
}

interface NodeSystemCollectioEntry {
	data: NodeSystemData;
	create: (props: NodeSystemData) => Roact.Element;
}

const idPool = new IdPool();
const NodeSystemCollection = [] as NodeSystemCollectioEntry[];

export const NodeSystemsChanged = new Event();

export function GetNextNodeSystemId(): number {
	return idPool.GetNextId();
}

export function UpdateNodeSystemAnchorPoint(id: number, offset: Vector2) {
	const nodeSystem = NodeSystemCollection.find((system) => system.data.id === id);
	if (nodeSystem) {
		nodeSystem.data.anchorPoint = GetMousePositionOnCanvas().add(offset);
		// NodeSystemsChanged.Fire();
	}
}

export function GetNodeSystems(): NodeSystemCollectioEntry[] {
	return NodeSystemCollection;
}

export function AddNodeSystem(nodeSystem: NodeSystemCollectioEntry) {
	NodeSystemCollection.push(nodeSystem);
	// NodeSystemsChanged.Fire();
}

export function RemoveNodeSystem(id: number) {
	NodeSystemCollection.remove(id);
	NodeSystemsChanged.Fire();
}
