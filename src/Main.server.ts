import { CreateNode } from "Nodes";
import { InitUI } from "UIHandler";

const toolbar = plugin.CreateToolbar("CrescentVFX");
const button = toolbar.CreateButton("Open Graph", "Opens Graph", "rbxassetid://7982947463");

const widgetInfo = new DockWidgetPluginGuiInfo(Enum.InitialDockState.Float, false, false, 200, 300, 150, 200);
const widget = plugin.CreateDockWidgetPluginGui("Graph", widgetInfo);
widget.Title = "CrescentVFX Graph";

button.Click.Connect(() => {
	widget.Enabled = !widget.Enabled;
});

CreateNode();
InitUI(widget);
