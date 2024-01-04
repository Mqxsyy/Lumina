let widget: DockWidgetPluginGui;

export function SetWidget(dockWidgetPluginGui: DockWidgetPluginGui) {
	widget = dockWidgetPluginGui;
}

export function GetMousePosition(): Vector2 {
	return widget.GetRelativeMousePosition();
}

export function GetWidget(): DockWidgetPluginGui {
	return widget;
}
