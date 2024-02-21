import Roact from "@rbxts/roact";
import { App } from "Components/App";
import { GetWidget } from "WidgetHandler";

let canvas = undefined as Roact.Tree | undefined;

export function InitUI() {
	const widget = GetWidget();
	canvas = Roact.mount(<App />, widget, "Graph");
}

export function GetCanvas() {
	return canvas;
}
