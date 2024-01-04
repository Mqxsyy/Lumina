import Roact from "@rbxts/roact";
import { App } from "Components/App";
import { UIUpdateEvent } from "Events";

let canvas = undefined as Roact.Tree | undefined;

UIUpdateEvent.Event.Connect(() => {
	canvas = Roact.update(canvas as Roact.Tree, <App />);
});

export function InitUI(widget: DockWidgetPluginGui) {
	canvas = Roact.mount(<App />, widget, "Graph");
}
