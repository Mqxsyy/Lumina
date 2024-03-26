import { Event } from "API/Bindables/Event";

export enum Windows {
	CrescentVFX = "CrescentVFX",
	ValueGraph = "Value Graph",
	ColorPicker = "Color Picker",
}

export const OnWinowLoaded = new Event<[Windows]>();

const windows = {
	[Windows.CrescentVFX]: {
		Widget: undefined as DockWidgetPluginGui | undefined,
		Info: new DockWidgetPluginGuiInfo(Enum.InitialDockState.Float, false, false, 800, 600, 200, 150),
	},
	[Windows.ValueGraph]: {
		Widget: undefined as DockWidgetPluginGui | undefined,
		Info: new DockWidgetPluginGuiInfo(Enum.InitialDockState.Float, false, false, 500, 400, 200, 150),
	},
	[Windows.ColorPicker]: {
		Widget: undefined as DockWidgetPluginGui | undefined,
		Info: new DockWidgetPluginGuiInfo(Enum.InitialDockState.Float, false, false, 400, 400, 200, 200),
	},
};

export function InitializeWindows(plugin: Plugin) {
	for (const [key, value] of pairs(windows)) {
		windows[key].Widget = plugin.CreateDockWidgetPluginGui(key, value.Info);
		windows[key].Widget!.Name = key;
		windows[key].Widget!.Title = key;
		windows[key].Widget!.Enabled = false;
		OnWinowLoaded.Fire(key);
	}
}

export function GetWindow(window: Windows) {
	return windows[window].Widget;
}
