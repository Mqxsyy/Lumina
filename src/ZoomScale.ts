import { Event } from "API/Bindables/Event";

// TODO: reimplement zoom

const zoomScale = 1;
const lastZoomScale = 1;

export const ZoomScaleChanged = new Event<[number]>();

export const ZoomScaleConstraint = {
	min: 0.5,
	max: 1.5,
};

export function GetZoomScale(): number {
	return zoomScale;
}

export function GetLastZoomScale(): number {
	return lastZoomScale;
}

export function UpdateZoomScale(value: number) {
	// let newZoomScale = GetZoomScale() + value;
	// if (newZoomScale > ZoomScaleConstraint.max) {
	// 	newZoomScale = ZoomScaleConstraint.max;
	// } else if (newZoomScale < ZoomScaleConstraint.min) {
	// 	newZoomScale = ZoomScaleConstraint.min;
	// }
	// lastZoomScale = zoomScale;
	// zoomScale = newZoomScale;
	// ZoomScaleChanged.Fire(zoomScale);
}
