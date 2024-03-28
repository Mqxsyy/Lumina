import { InitializeLineGraph } from "Components/Windows/Line/LineGraph";
import { InitializeColorPicker } from "Components/Windows/Pickers.tsx/ColorPicker";
import { InitializeColorRamp } from "Components/Windows/Ramps/ColorRamp";
import { InitUI } from "UIHandler";
import { GetWindow, InitializeWindows, Windows } from "Windows/WindowSevice";

const toolbar = plugin.CreateToolbar("CrescentVFX");
const button = toolbar.CreateButton("Open Graph", "Opens Graph", "rbxassetid://7982947463");

InitializeWindows(plugin); // widgets are bloody annoying to work with

const window = GetWindow(Windows.CrescentVFX)!;
window.ZIndexBehavior = Enum.ZIndexBehavior.Sibling; //--> why tf does this make the background images disappear near corners

button.Click.Connect(() => {
	window.Enabled = !window.Enabled;
});

InitUI();

InitializeLineGraph();
InitializeColorPicker();
InitializeColorRamp();

// CreateBasicNodeSystem();
