import { Event } from "API/Bindables/Event";
import { GetWindow, OnWinowLoaded, Windows } from "./WindowSevice";
import { GetCanvas } from "Events";

export const WidgetSizeChanged = new Event<[Vector2]>();

OnWinowLoaded.Connect((loadedWindow) => {
	if (loadedWindow !== Windows.CrescentVFX) return;

	const window = GetWindow(Windows.CrescentVFX)!;
	window.GetPropertyChangedSignal("AbsoluteSize").Connect(() => {
		WidgetSizeChanged.Fire(window.AbsoluteSize);
	});
});

export function GetMousePosition(): Vector2 {
	return GetWindow(Windows.CrescentVFX)!.GetRelativeMousePosition();
}

export function GetMousePositionOnCanvas(): Vector2 {
	const canvasFrame = GetCanvas.Invoke() as Frame;
	const pos = new Vector2(canvasFrame.AbsolutePosition.X, canvasFrame.AbsolutePosition.Y);
	return GetMousePosition().sub(pos);
}
