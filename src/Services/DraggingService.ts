import { Event } from "API/Event";

export interface DraggingNode {
	id: number;
	element: TextButton;
}

export const NodeDraggingEnded = new Event<[DraggingNode]>();

let draggingNode: DraggingNode | undefined;

export function SetDraggingNode(node: DraggingNode | undefined) {
	if (node === undefined) {
		NodeDraggingEnded.Fire(draggingNode as DraggingNode);
	}

	draggingNode = node;
}

export function GetDraggingNode() {
	return draggingNode;
}
