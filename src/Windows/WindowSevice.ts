import { Event } from "API/Bindables/Event";

export enum Windows {
    Lumina = "Lumina",
    ValueGraph = "Value Graph",
    ColorPicker = "Color Picker",
    ColorRamp = "Color Ramp",
    RequestUpdate = "Lumina Update Checker",
}

export const OnWinowLoaded = new Event<[Windows]>();

const windows = {
    [Windows.Lumina]: {
        Widget: undefined as DockWidgetPluginGui | undefined,
        Info: new DockWidgetPluginGuiInfo(Enum.InitialDockState.Float, false, false, 800, 600, 200, 150),
    },
    [Windows.ValueGraph]: {
        Widget: undefined as DockWidgetPluginGui | undefined,
        Info: new DockWidgetPluginGuiInfo(Enum.InitialDockState.Float, false, false, 400, 300, 200, 150),
    },
    [Windows.ColorPicker]: {
        Widget: undefined as DockWidgetPluginGui | undefined,
        Info: new DockWidgetPluginGuiInfo(Enum.InitialDockState.Float, false, false, 400, 400, 300, 300),
    },
    [Windows.ColorRamp]: {
        Widget: undefined as DockWidgetPluginGui | undefined,
        Info: new DockWidgetPluginGuiInfo(Enum.InitialDockState.Float, false, false, 400, 200, 200, 100),
    },
    [Windows.RequestUpdate]: {
        Widget: undefined as DockWidgetPluginGui | undefined,
        Info: new DockWidgetPluginGuiInfo(Enum.InitialDockState.Float, false, false, 400, 150, 400, 150),
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
