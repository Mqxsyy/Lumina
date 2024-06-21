import CheckForUpdates from "Components/Windows/UpdateChecker/CheckForUpdates";
import { GetWindow, InitializeWindows, Windows } from "Services/WindowSevice";
InitializeWindows(plugin); // widgets are bloody annoying to work with
CheckForUpdates(plugin);

import { InitializeImageBrowser } from "Components/Windows/Browsers/ImageBrowser/ImageBrowser";
import { InitializeMeshBrowser } from "Components/Windows/Browsers/MeshBrowser/MeshBrowser";
import { InitializeMeshEditor } from "Components/Windows/Browsers/MeshBrowser/MeshUploader";
import { InitializeLineGraph } from "Components/Windows/Line/LineGraph";
import { InitializeMain } from "Components/Windows/Main/App";
import { InitializeColorPicker } from "Components/Windows/Pickers.tsx/ColorPicker";
import { InitializeColorRamp } from "Components/Windows/Ramps/ColorRamp";

const toolbar = plugin.CreateToolbar("Lumina 0.2.0");

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

InitializeMain();

InitializeImageBrowser();
InitializeMeshBrowser();

InitializeLineGraph();
InitializeColorPicker();
InitializeColorRamp();
