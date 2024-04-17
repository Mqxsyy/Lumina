import Roact from "@rbxts/roact";
import { Event } from "API/Bindables/Event";
import { IdPool } from "API/IdPool";
import { Node } from "API/Nodes/Node";
import { GetMousePositionOnCanvas } from "Windows/MainWindow";

// TODO: Add render order changing

export interface NodeConnectionOut {
	id: number;
}

export interface NodeConnectionIn {
	id: number;
	fieldName: string;
}

export interface NodeData {
	id: number;
	anchorPoint: Vector2;
	connectionsOut: NodeConnectionOut[];
	connectionsIn: NodeConnectionIn[];
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

export function AddNode(api: Node, create: (data: NodeData) => Roact.Element) {
	const collectionEntry: NodeCollectionEntry = {
		data: {
			id: GetNextNodeId(),
			anchorPoint: GetMousePositionOnCanvas(),
			connectionsOut: [],
			connectionsIn: [],
			elementLoaded: new Event(),
			node: api,
		},
		create: create,
	};

	NodeCollection.push(collectionEntry);
	NodesChanged.Fire();

	return collectionEntry.data;
}

export function UpdateNodeData(id: number, callback: (data: NodeData) => NodeData) {
	const node = NodeCollection.find((node) => node.data.id === id);

	if (node) {
		node.data = callback(node.data);
		NodesChanged.Fire();
		return;
	}

	warn(`Node with id ${id} not found`);
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
	const index = NodeCollection.findIndex((node) => node.data.id === id);
	if (index !== -1) {
		idPool.ReleaseId(id);

		NodeCollection.remove(index);
		NodesChanged.Fire();
		return;
	}

	warn(`Failed to delete node. Id not found`);
}
