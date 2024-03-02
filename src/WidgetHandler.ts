import { Event } from "API/Event";
import { GetCanvas } from "Events";

let widget: DockWidgetPluginGui;

export const WidgetSizeChanged = new Event<[Vector2]>();

export function SetWidget(dockWidgetPluginGui: DockWidgetPluginGui) {
	widget = dockWidgetPluginGui;

	widget.GetPropertyChangedSignal("AbsoluteSize").Connect(() => {
		WidgetSizeChanged.Fire(widget.AbsoluteSize);
	});
}

export function GetMousePosition(): Vector2 {
	return widget.GetRelativeMousePosition();
}

export function GetMousePositionOnCanvas(): Vector2 {
	const canvasFrame = GetCanvas.Invoke() as Frame;
	const pos = new Vector2(canvasFrame.AbsolutePosition.X, canvasFrame.AbsolutePosition.Y);
	return GetMousePosition().sub(pos);
}

export function GetWidget(): DockWidgetPluginGui {
	return widget;
}
