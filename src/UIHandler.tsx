import Roact from "@rbxts/roact";
import { App } from "Components/App";
import { GetCanvasFrame } from "Events";
import { GetWidget } from "WidgetHandler";

let canvas = undefined as Roact.Tree | undefined;
let canvasFrame = undefined as Frame | undefined;

const SetCanvasFrame = (frame: Frame) => {
	canvasFrame = frame;
};

GetCanvasFrame.OnInvoke = () => {
	return canvasFrame;
};

export function InitUI() {
	const widget = GetWidget();
	canvas = Roact.mount(<App fn={SetCanvasFrame} />, widget, "Graph");
}
