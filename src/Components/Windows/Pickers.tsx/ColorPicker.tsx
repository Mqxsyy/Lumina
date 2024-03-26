import Roact from "@rbxts/roact";
import Div from "Components/Div";
import { StyleColors } from "Style";
import { GetWindow, Windows } from "Windows/WindowSevice";

export function InitializeColorPicker() {
	Roact.mount(<ColorPicker />, GetWindow(Windows.ColorPicker)!, "LineGraph");
}

function ColorPicker() {
	return <Div BackgroundColor={StyleColors.Background} />;
}
