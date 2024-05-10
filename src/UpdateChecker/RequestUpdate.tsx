import React, { StrictMode } from "@rbxts/react";
import { createRoot } from "@rbxts/react-roblox";
import { BasicTextLabel } from "Components/Basic/BasicTextLabel";
import Div from "Components/Div";
import { StyleColors } from "Style";
import { GetWindow, Windows } from "Windows/WindowSevice";

export default function RequestUpdate() {
    const window = GetWindow(Windows.RequestUpdate)!;
    const root = createRoot(window);

    root.render(
        <StrictMode>
            <Div BackgroundColor={StyleColors.Background}>
                <BasicTextLabel
                    TextXAlignment="Center"
                    TextWrapped={true}
                    Text="New update available for Lumina. Please go to 'Manage Plugins' and update Lumina."
                />
            </Div>
        </StrictMode>,
    );

    window.Enabled = true;
}
