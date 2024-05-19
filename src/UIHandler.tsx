import React, { StrictMode } from "@rbxts/react";
import { createRoot } from "@rbxts/react-roblox";
import { App } from "Components/App";
import { GetWindow, Windows } from "Windows/WindowSevice";

export function InitUI() {
    const window = GetWindow(Windows.Lumina);
    const root = createRoot(window);

    root.render(
        <StrictMode>
            <App />
        </StrictMode>,
    );
}
