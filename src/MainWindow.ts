import { Event } from "API/Bindables/Event";
import { GetCanvasData } from "Services/CanvasService";
import { GetWindow, Windows } from "./Services/WindowSevice";

export const WidgetSizeChanged = new Event<[Vector2]>();

const window = GetWindow(Windows.Lumina);
window.GetPropertyChangedSignal("AbsoluteSize").Connect(() => {
    WidgetSizeChanged.Fire(window.AbsoluteSize);
});

export function GetMousePosition(): Vector2 {
    return GetWindow(Windows.Lumina).GetRelativeMousePosition();
}

export function GetMousePositionOnCanvas(): Vector2 {
    const canvasData = GetCanvasData();
    const pos = new Vector2(canvasData.Position.X.Offset, canvasData.Position.Y.Offset);
    return GetMousePosition().sub(pos);
}
