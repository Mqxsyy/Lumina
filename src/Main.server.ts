import { InitUI } from "UIHandler";
import { SetWidget } from "WidgetHandler";
import { InitializeWindows } from "Windows/WindowSevice";

const toolbar = plugin.CreateToolbar("CrescentVFX");
const button = toolbar.CreateButton("Open Graph", "Opens Graph", "rbxassetid://7982947463");

const widgetInfo = new DockWidgetPluginGuiInfo(Enum.InitialDockState.Float, false, false, 600, 500, 200, 150);
const widget = plugin.CreateDockWidgetPluginGui("CrescentVFX Graph", widgetInfo);
widget.Name = "CrescentVFX Graph";
widget.ZIndexBehavior = Enum.ZIndexBehavior.Sibling; //--> why tf does this make the background images disappear near corners
widget.Title = "CrescentVFX Graph";

SetWidget(widget);

button.Click.Connect(() => {
	widget.Enabled = !widget.Enabled;
});

InitUI();
InitializeWindows(plugin); // widgets are bloody annoying to work with

// CreateBasicNodeSystem();
