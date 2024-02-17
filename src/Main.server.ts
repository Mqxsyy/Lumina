import { InitUI } from "UIHandler";
import { SetWidget } from "WidgetHandler";

const toolbar = plugin.CreateToolbar("CrescentVFX");
const button = toolbar.CreateButton("Open Graph", "Opens Graph", "rbxassetid://7982947463");

const widgetInfo = new DockWidgetPluginGuiInfo(Enum.InitialDockState.Float, false, false, 300, 200, 200, 150);
const widget = plugin.CreateDockWidgetPluginGui("Graph", widgetInfo);
// widget.ZIndexBehavior = Enum.ZIndexBehavior.Sibling; //--> why tf does this make the background images disappear near corners
widget.Title = "CrescentVFX Graph";

SetWidget(widget);

button.Click.Connect(() => {
	widget.Enabled = !widget.Enabled;
});

InitUI();
