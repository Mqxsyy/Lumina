import { Event } from "API/Bindables/Event";

// TODO: make zoom go to cursor

let zoomScale = 1;
export const ZoomScaleChanged = new Event<[number]>();

export const ZoomScaleConstraint = {
	min: 0.25,
	max: 1.5,
};

export function GetZoomScale(): number {
	return zoomScale;
	// return 1;
}

export function UpdateZoomScale(value: number) {
	let newZoomScale = zoomScale + value;

	if (newZoomScale > ZoomScaleConstraint.max) {
		newZoomScale = ZoomScaleConstraint.max;
	} else if (newZoomScale < ZoomScaleConstraint.min) {
		newZoomScale = ZoomScaleConstraint.min;
	}

	if (zoomScale !== newZoomScale) {
		zoomScale = newZoomScale;
		ZoomScaleChanged.Fire(zoomScale);
	}
}
