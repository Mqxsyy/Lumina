import Roact from "@rbxts/roact";
import { App } from "Components/App";
import { CreateNode } from "Nodes";

let canvas = undefined as Roact.Tree | undefined;

export function InitUI(widget: DockWidgetPluginGui) {
	canvas = Roact.mount(<App />, widget, "Graph");
}

function UpdateUI() {
	CreateNode();
	canvas = Roact.update(canvas as Roact.Tree, <App />);
}
