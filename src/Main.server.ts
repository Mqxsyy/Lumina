import CheckForUpdates from "UpdateChecker/CheckForUpdates";
import { GetWindow, InitializeWindows, Windows } from "Windows/WindowSevice";
InitializeWindows(plugin); // widgets are bloody annoying to work with
CheckForUpdates(plugin);

import { InitializeLineGraph } from "Components/Windows/Line/LineGraph";
import { InitializeColorPicker } from "Components/Windows/Pickers.tsx/ColorPicker";
import { InitializeColorRamp } from "Components/Windows/Ramps/ColorRamp";
import { InitUI } from "UIHandler";

const toolbar = plugin.CreateToolbar("Lumina 0.1.2");

// i guess I'll try to follow this versioning
// MAJOR.MINOR.PATCH
// MAJOR version increments indicate backward-incompatible changes.
// MINOR version increments denote backward-compatible additions.
// PATCH version increments represent backward-compatible bug fixes.

const mainButton = toolbar.CreateButton("Lumina", "Opens VFX Graph", "rbxassetid://17315034818"); // Border 17315079935 ; White 17315034818

const window = GetWindow(Windows.Lumina);
window.ZIndexBehavior = Enum.ZIndexBehavior.Sibling; //--> why tf does this make the background images disappear near corners

mainButton.Click.Connect(() => {
    window.Enabled = !window.Enabled;
});

InitUI();

InitializeLineGraph();
InitializeColorPicker();
InitializeColorRamp();
