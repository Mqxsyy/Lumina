import Roact from "@rbxts/roact";
import { Event } from "API/Event";
import { IdPool } from "API/IdPool";
import { GetMousePositionOnCanvas } from "WidgetHandler";

// TODO: Add render order changing

export interface NodeData {
	id: number;
	anchorPoint: Vector2;
}

interface NodeCollectionEntry {
	data: NodeData;
	create: (props: NodeData) => Roact.Element;
}

const idPool = new IdPool();
const NodeCollection = [] as NodeCollectionEntry[];

export const NodesChanged = new Event();

export function GetNextNodeId(): number {
	return idPool.GetNextId();
}

export function UpdateNodeAnchorPoint(id: number, offset: Vector2) {
	const node = NodeCollection.find((node) => node.data.id === id);
	if (node) {
		node.data.anchorPoint = GetMousePositionOnCanvas().add(offset);
		// NodesChanged.Fire();
	}
}

export function GetNodeSystems(): NodeCollectionEntry[] {
	return NodeCollection;
}

export function AddNodeSystem(nodeSystem: NodeCollectionEntry) {
	NodeCollection.push(nodeSystem);
	// NodesChanged.Fire();
}

export function RemoveNodeSystem(id: number) {
	NodeCollection.remove(id);
	NodesChanged.Fire();
}
