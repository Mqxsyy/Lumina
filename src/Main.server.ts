import CheckForUpdates from "UpdateChecker/CheckForUpdates";
import { InitializeLineGraph } from "Components/Windows/Line/LineGraph";
import { InitializeColorPicker } from "Components/Windows/Pickers.tsx/ColorPicker";
import { InitializeColorRamp } from "Components/Windows/Ramps/ColorRamp";
import { InitUI } from "UIHandler";
import { GetWindow, InitializeWindows, Windows } from "Windows/WindowSevice";

// TODO: add button to reset all windows - simply reinitializing everything does not work. Alternatively just resetting studio works

const toolbar = plugin.CreateToolbar("Lumina 0.0.3");

// i guess I'll try to follow this versioning
// MAJOR.MINOR.PATCH
// MAJOR version increments indicate backward-incompatible changes.
// MINOR version increments denote backward-compatible additions.
// PATCH version increments represent backward-compatible bug fixes.

const mainButton = toolbar.CreateButton("Lumina", "Opens VFX Graph", "rbxassetid://17315034818"); // Border 17315079935 ; White 17315034818

InitializeWindows(plugin); // widgets are bloody annoying to work with
const window = GetWindow(Windows.Lumina)!;
window.ZIndexBehavior = Enum.ZIndexBehavior.Sibling; //--> why tf does this make the background images disappear near corners

mainButton.Click.Connect(() => {
    window.Enabled = !window.Enabled;
});

InitUI();

InitializeLineGraph();
InitializeColorPicker();
InitializeColorRamp();

CheckForUpdates();
