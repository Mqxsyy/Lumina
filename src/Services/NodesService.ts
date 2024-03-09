import Roact from "@rbxts/roact";
import { Event } from "API/Event";
import { IdPool } from "API/IdPool";
import { Node } from "API/Nodes/Node";

// TODO: Add render order changing

export interface NodeData {
	id: number;
	anchorPoint: Vector2;
	element?: TextButton;
	elementLoaded: Event;
	node: Node;
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

export function UpdateNodeAnchorPoint(id: number, anchorPoint: Vector2) {
	const node = NodeCollection.find((node) => node.data.id === id);
	if (node) {
		node.data.anchorPoint = anchorPoint;
		NodesChanged.Fire();
	} else {
		warn(`Node with id ${id} not found`);
	}
}

export function GetAllNodes(): NodeCollectionEntry[] {
	return NodeCollection;
}

export function GetNodeById(id: number) {
	return NodeCollection.find((node) => node.data.id === id);
}

export function AddNode(nodeSystem: NodeCollectionEntry) {
	NodeCollection.push(nodeSystem);
	NodesChanged.Fire();
	return nodeSystem.data;
}

export function SetNodeElement(id: number, element: TextButton) {
	const node = NodeCollection.find((node) => node.data.id === id);

	if (node) {
		if (node.data.element !== undefined) return;

		node.data.element = element;
		node.data.elementLoaded.Fire();
		return;
	}

	warn(`Node with id ${id} not found`);
}

export function RemoveNode(id: number) {
	NodeCollection.remove(id);
	NodesChanged.Fire();
}
