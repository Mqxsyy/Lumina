import { Event } from "API/Bindables/Event";

export const NodeDraggingStarted = new Event<[number]>();
export const NodeDraggingEnded = new Event<[number]>();

let draggingNodeId: number | undefined;

export function SetDraggingNodeId(id: number | undefined) {
    if (id === undefined && draggingNodeId !== undefined) {
        NodeDraggingEnded.Fire(draggingNodeId!);
    }

    draggingNodeId = id;
    if (draggingNodeId !== undefined) {
        NodeDraggingStarted.Fire(draggingNodeId);
    }
}

export function GetDraggingNodeId() {
    return draggingNodeId;
}
