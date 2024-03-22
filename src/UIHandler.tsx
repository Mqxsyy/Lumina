import Roact from "@rbxts/roact";
import { App } from "Components/App";
import { GetWindow, Windows } from "Windows/WindowSevice";

let canvas = undefined as Roact.Tree | undefined;

export function InitUI() {
	const window = GetWindow(Windows.CrescentVFX)!;
	canvas = Roact.mount(<App />, window, "Graph");
}

export function GetCanvas() {
	return canvas;
}
