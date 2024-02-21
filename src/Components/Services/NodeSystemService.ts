import Roact from "@rbxts/roact";
import { IdPool } from "API/IdPool";
import { GetMousePositionOnCanvas } from "WidgetHandler";

// TODO: Add render order changing

const idPool = new IdPool();

export interface NodeSystemData {
	id: number;
	anchorPoint: Vector2;
}

interface NodeSystemCollectioEntry {
	data: NodeSystemData;
	create: (props: NodeSystemData) => Roact.Element;
}

const NodeSystemCollection = [] as NodeSystemCollectioEntry[];

export function GetNodeSystemId(): number {
	return idPool.GetNextId();
}

export function UpdateNodeSystemAnchorPoint(id: number, offset: Vector2) {
	const nodeSystem = NodeSystemCollection.find((system) => system.data.id === id);
	if (nodeSystem) {
		nodeSystem.data.anchorPoint = GetMousePositionOnCanvas().add(offset);
	}
}

export function GetNodeSystems(): NodeSystemCollectioEntry[] {
	return NodeSystemCollection;
}

export function AddNodeSystem(nodeSystem: NodeSystemCollectioEntry) {
	NodeSystemCollection.push(nodeSystem);
}

export function RemoveNodeSystem(id: number) {
	NodeSystemCollection.remove(id);
}
