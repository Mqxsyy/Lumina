import Roact from "@rbxts/roact";
import { App } from "Components/App";
import { GetCanvasFrame, UIUpdateEvent } from "Events";

let canvas = undefined as Roact.Tree | undefined;
let canvasFrame = undefined as Frame | undefined;

const SetCanvasFrame = (frame: Frame) => {
	canvasFrame = frame;
};

UIUpdateEvent.Event.Connect(() => {
	canvas = Roact.update(canvas as Roact.Tree, <App fn={SetCanvasFrame} />);
});

GetCanvasFrame.OnInvoke = () => {
	return canvasFrame;
};

export function InitUI(widget: DockWidgetPluginGui) {
	canvas = Roact.mount(<App fn={SetCanvasFrame} />, widget, "Graph");
}
