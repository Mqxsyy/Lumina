import { FastEvent } from "API/Bindables/FastEvent";

let isHoldingControl = false;

let selectedNodeId = -1;
let selectedSystemId = -1;
export const selectedNodeIdChanged = new FastEvent<[number]>();
export const selectedSystemIdChanged = new FastEvent<[number]>();

export function SetIsHoldingControl(bool: boolean) {
    isHoldingControl = bool;
}

export function GetIsHoldingControl() {
    return isHoldingControl;
}

export function SetSelectNodeId(nodeId: number) {
    if (selectedSystemId !== -1) {
        SetSelectSystemId(-1);
    }

    selectedNodeId = nodeId;
    selectedNodeIdChanged.Fire(nodeId);
}

export function GetSelectedNodeId() {
    return selectedNodeId;
}

export function SetSelectSystemId(systemId: number) {
    if (selectedNodeId !== -1) {
        SetSelectNodeId(-1);
    }

    selectedSystemId = systemId;
    selectedSystemIdChanged.Fire(systemId);
}

export function GetSelectedSystemId() {
    return selectedSystemId;
}
