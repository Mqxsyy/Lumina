import { Event } from "API/Event";

let zoomScale = 1;
let lastZoomScale = 1;

export const ZoomScaleChanged = new Event();

export const ZoomScaleConstraint = {
	min: 0.3,
	max: 1.5,
};

export function GetZoomScale(): number {
	return zoomScale;
}

export function GetLastZoomScale(): number {
	return lastZoomScale;
}

export function UpdateZoomScale(value: number) {
	let newZoomScale = GetZoomScale() + value;

	if (newZoomScale > ZoomScaleConstraint.max) {
		newZoomScale = ZoomScaleConstraint.max;
	} else if (newZoomScale < ZoomScaleConstraint.min) {
		newZoomScale = ZoomScaleConstraint.min;
	}

	lastZoomScale = zoomScale;
	zoomScale = newZoomScale;
	ZoomScaleChanged.Fire(zoomScale);
}
