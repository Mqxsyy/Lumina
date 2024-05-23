import { Event } from "API/Bindables/Event";
import { RoundDecimal } from "API/Lib";

let zoomScale = 1;
export const ZoomScaleChanged = new Event<[number]>();

export const ZoomScaleConstraint = {
    min: 0.2,
    max: 1.5,
};

export function GetZoomScale(): number {
    return zoomScale;
}

export function UpdateZoomScale(value: number) {
    let newZoomScale = RoundDecimal(zoomScale + value, 0.01);

    if (newZoomScale > ZoomScaleConstraint.max) {
        newZoomScale = ZoomScaleConstraint.max;
    } else if (newZoomScale < ZoomScaleConstraint.min) {
        newZoomScale = ZoomScaleConstraint.min;
    }

    if (zoomScale !== newZoomScale) {
        zoomScale = newZoomScale;
        ZoomScaleChanged.Fire(zoomScale);
    }

    return zoomScale;
}
