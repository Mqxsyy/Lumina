export enum Windows {
	ValueGraph = "Value Graph",
}

const windows = {
	[Windows.ValueGraph]: {
		Widget: undefined as DockWidgetPluginGui | undefined,
		Info: new DockWidgetPluginGuiInfo(Enum.InitialDockState.Float, false, false, 300, 200, 200, 150),
	},
};

export function InitializeWindows(plugin: Plugin) {
	for (const [key, value] of pairs(windows)) {
		windows[key].Widget = plugin.CreateDockWidgetPluginGui(key, value.Info);
		windows[key].Widget!.Title = key;
		windows[key].Widget!.Enabled = false;
	}
}

export function GetWindow(window: Windows) {
	return windows[window].Widget;
}
