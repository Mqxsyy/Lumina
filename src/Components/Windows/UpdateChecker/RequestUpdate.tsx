import React, { StrictMode } from "@rbxts/react";
import { createRoot } from "@rbxts/react-roblox";
import { BasicTextLabel } from "Components/Basic/BasicTextLabel";
import Div from "Components/Div";
import { GetWindow, Windows } from "Services/WindowSevice";
import { StyleColors } from "API/Style";

export default function RequestUpdate() {
    const window = GetWindow(Windows.RequestUpdate);
    const root = createRoot(window);

    root.render(
        <StrictMode>
            <Div BackgroundColor={StyleColors.Background}>
                <uilistlayout FillDirection="Vertical" VerticalAlignment={"Center"} Padding={new UDim(0, 4)} />
                <uipadding PaddingLeft={new UDim(0, 20)} PaddingRight={new UDim(0, 20)} />

                <BasicTextLabel
                    AutomaticSize="Y"
                    Size={UDim2.fromScale(1, 0)}
                    TextXAlignment="Center"
                    TextWrapped={true}
                    Text="New update available for Lumina. Please go to 'Manage Plugins' and update Lumina."
                    TextSize={20}
                    TextYAlignment="Bottom"
                />

                <BasicTextLabel
                    AutomaticSize="Y"
                    Size={UDim2.fromScale(1, 0)}
                    TextXAlignment="Center"
                    TextWrapped={true}
                    TextColor={new Color3(1, 0, 0)}
                    TextSize={18}
                    FontWeight={Enum.FontWeight.ExtraBold}
                    Text="WARNING: May break existing VFX and SaveData."
                    TextYAlignment="Top"
                />
            </Div>
        </StrictMode>,
    );

    window.Enabled = true;
}
