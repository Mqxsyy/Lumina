// circular depency hell, just use events and function instead
export const UIUpdateEvent = new Instance("BindableEvent");
export const ZoomScaleUpdateEvent = new Instance("BindableEvent");

export const GetCanvasFrame = new Instance("BindableFunction");
