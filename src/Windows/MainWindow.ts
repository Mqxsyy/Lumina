import { Event } from "API/Bindables/Event";
import { GetWindow, OnWinowLoaded, Windows } from "./WindowSevice";
import { GetCanvasData } from "Services/CanvasService";

export const WidgetSizeChanged = new Event<[Vector2]>();

OnWinowLoaded.Connect((loadedWindow) => {
	if (loadedWindow !== Windows.LunarVFX) return;

	const window = GetWindow(Windows.LunarVFX)!;
	window.GetPropertyChangedSignal("AbsoluteSize").Connect(() => {
		WidgetSizeChanged.Fire(window.AbsoluteSize);
	});
});

export function GetMousePosition(): Vector2 {
	return GetWindow(Windows.LunarVFX)!.GetRelativeMousePosition();
}

export function GetMousePositionOnCanvas(): Vector2 {
	const canvasData = GetCanvasData();
	const pos = new Vector2(canvasData.Position.X.Offset, canvasData.Position.Y.Offset);
	return GetMousePosition().sub(pos);
}
