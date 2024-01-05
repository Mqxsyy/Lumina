import { GetCanvasFrame } from "Events";

let widget: DockWidgetPluginGui;

export function SetWidget(dockWidgetPluginGui: DockWidgetPluginGui) {
	widget = dockWidgetPluginGui;
}

export function GetMousePosition(): Vector2 {
	return widget.GetRelativeMousePosition();
}

export function GetMousePositionOnCanvas(): Vector2 {
	const canvasFrame = GetCanvasFrame.Invoke() as Frame;
	const pos = new Vector2(canvasFrame.AbsolutePosition.X, canvasFrame.AbsolutePosition.Y);
	return GetMousePosition().sub(pos);
}

export function GetWidget(): DockWidgetPluginGui {
	return widget;
}
