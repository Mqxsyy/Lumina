import { Event } from "API/Event";

export const NodeDraggingEnded = new Event<[number]>();

let draggingNodeId: number | undefined;

export function SetDraggingNodeId(id: number | undefined) {
	if (id === undefined) {
		NodeDraggingEnded.Fire(draggingNodeId as number);
	}

	draggingNodeId = id;
}

export function GetDraggingNodeId() {
	return draggingNodeId;
}
