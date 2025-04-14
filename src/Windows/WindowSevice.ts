export enum Windows {
    Lumina = "Lumina",
    ValueGraph = "Lumina Value Graph",
    ColorPicker = "Lumina Color Picker",
    ColorRamp = "Lumina Color Ramp",
    RequestUpdate = "Lumina Update Checker",
    UpdateLog = "Lumina Update Log",
}

interface Window {
    Widget: DockWidgetPluginGui | undefined;
    Info: DockWidgetPluginGuiInfo;
}

const windows: { [key in Windows]: Window } = {
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
    [Windows.UpdateLog]: {
        Widget: undefined as DockWidgetPluginGui | undefined,
        Info: new DockWidgetPluginGuiInfo(Enum.InitialDockState.Float, false, false, 600, 250, 400, 200),
    },
};

export function InitializeWindows(plugin: Plugin) {
    for (const [key, value] of pairs(windows)) {
        const widget = plugin.CreateDockWidgetPluginGui(key, value.Info);
        widget.Name = key;
        widget.Enabled = false;

        windows[key].Widget = widget;
    }
}

export function GetWindow(window: Windows) {
    return windows[window].Widget as DockWidgetPluginGui;
}
