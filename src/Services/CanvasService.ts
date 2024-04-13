import { Event } from "API/Bindables/Event";

interface CanvasData {
	Position: UDim2;
	Size: UDim2;
	AbsolutePosition: UDim2;
}

let canvasData: CanvasData = {
	Position: UDim2.fromOffset(0, 0),
	Size: UDim2.fromOffset(0, 0),
	AbsolutePosition: UDim2.fromOffset(0, 0),
};

export const CanvasDataChanged = new Event();

export function GetCanvasData() {
	return canvasData;
}

export function UpdateCanvasData(callback: (canvasData: CanvasData) => CanvasData) {
	canvasData = callback(canvasData);
	CanvasDataChanged.Fire();
}
