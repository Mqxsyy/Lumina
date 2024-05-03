import React from "@rbxts/react";
import { Event } from "API/Bindables/Event";
import { NodeGroups } from "API/NodeGroup";
import { Node } from "API/Nodes/Node";
import { RenderNode } from "API/Nodes/Render/RenderNode";
import { GetMousePositionOnCanvas } from "Windows/MainWindow";
import { GetZoomScale } from "ZoomScale";

// TODO: Add render order changing

export interface NodeConnectionOut {
	id: number;
}

export interface NodeConnectionIn {
	id: number;
	fieldName: string;
}

export interface NodeData {
	anchorPoint: Vector2;
	connectionsOut: NodeConnectionOut[];
	loadedConnectionsOut?: NodeConnectionOut[];
	connectionsIn: NodeConnectionIn[];
	loadedConnectionsIn?: NodeConnectionIn[];
	node: Node;
	onDestroy: Event<[NodeData]>;
}

export interface NodeCollectionEntry {
	data: NodeData;
	element?: ImageButton;
	elementLoaded: Event;
	create: (props: NodeData) => React.Element;
}

const NodeCollection = [] as NodeCollectionEntry[];
export const NodesChanged = new Event();

export function GetAllNodes(): NodeCollectionEntry[] {
	return NodeCollection;
}

export function GetNodeById(id: number) {
	return NodeCollection.find((collection) => collection.data.node.id === id);
}

export function AddNode(api: Node, create: (data: NodeData) => React.Element) {
	const collectionEntry: NodeCollectionEntry = {
		data: {
			anchorPoint: GetMousePositionOnCanvas().div(GetZoomScale()),
			connectionsOut: [],
			connectionsIn: [],
			node: api,
			onDestroy: new Event<[NodeData]>(),
		},
		elementLoaded: new Event(),
		create,
	};

	NodeCollection.push(collectionEntry);
	NodesChanged.Fire();

	return collectionEntry;
}

export function UpdateNodeData(id: number, callback: (data: NodeData) => NodeData) {
	const node = GetNodeById(id);
	if (node !== undefined) {
		node.data = callback(node.data);
		NodesChanged.Fire();
		return;
	}

	warn(`Node with id ${id} not found`);
}

export function SetNodeElement(id: number, element: ImageButton) {
	const node = GetNodeById(id);

	if (node !== undefined) {
		if (node.element !== undefined) return;

		node.element = element;
		node.elementLoaded.Fire();
		return;
	}

	warn(`Node with id ${id} not found`);
}

export function RemoveNode(id: number) {
	const index = NodeCollection.findIndex((collection) => collection.data.node.id === id);
	if (index !== -1) {
		const node = NodeCollection[index];
		if (node.data.node.nodeGroup === NodeGroups.Render) {
			(node.data.node as RenderNode).Destroy();
		}

		node.data.onDestroy.Fire(node.data);

		NodeCollection.remove(index);
		NodesChanged.Fire();

		return;
	}

	warn(`Failed to delete node. Id not found`);
}
