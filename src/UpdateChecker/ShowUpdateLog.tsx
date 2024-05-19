import React, { StrictMode } from "@rbxts/react";
import { createRoot } from "@rbxts/react-roblox";
import { BasicTextLabel } from "Components/Basic/BasicTextLabel";
import Div from "Components/Div";
import { StyleColors } from "Style";
import { GetWindow, Windows } from "Windows/WindowSevice";

// IMPORTANT: Make update log accurate

export default function ShowUpdateLog() {
    const window = GetWindow(Windows.UpdateLog);
    const root = createRoot(window);

    root.render(
        <StrictMode>
            <Div BackgroundColor={StyleColors.Background}>
                <uilistlayout FillDirection="Vertical" VerticalAlignment={"Top"} Padding={new UDim(0, 10)} />
                <uipadding
                    PaddingLeft={new UDim(0, 20)}
                    PaddingRight={new UDim(0, 20)}
                    PaddingBottom={new UDim(0, 20)}
                    PaddingTop={new UDim(0, 20)}
                />

                <BasicTextLabel
                    AutomaticSize="Y"
                    Size={UDim2.fromScale(1, 0)}
                    TextXAlignment="Center"
                    TextWrapped={true}
                    Text="Lumina Update 0.1.0"
                    FontWeight={Enum.FontWeight.ExtraBold}
                    TextSize={40}
                    TextYAlignment="Bottom"
                />
                <Div Size={UDim2.fromScale(1, 0.025)} />
                <Div Size={UDim2.fromScale(1, 0)} AutomaticSize="Y">
                    <uilistlayout FillDirection="Vertical" VerticalAlignment={"Top"} Padding={new UDim(0, 5)} />

                    <BasicTextLabel
                        AutomaticSize="Y"
                        Size={UDim2.fromScale(1, 0)}
                        TextXAlignment="Left"
                        TextWrapped={true}
                        Text="NEW FEATURES:"
                        FontWeight={Enum.FontWeight.Bold}
                        TextSize={28}
                        TextYAlignment="Bottom"
                    />
                    <Div Size={UDim2.fromScale(1, 0)} AutomaticSize="Y">
                        <uilistlayout FillDirection="Vertical" VerticalAlignment={"Top"} Padding={new UDim(0, 5)} />
                        <uipadding PaddingLeft={new UDim(0, 10)} />

                        <BasicTextLabel
                            AutomaticSize="Y"
                            Size={UDim2.fromScale(1, 0)}
                            TextXAlignment="Left"
                            TextWrapped={true}
                            Text="- Feature 1"
                            TextSize={20}
                            TextYAlignment="Bottom"
                        />
                        <BasicTextLabel
                            AutomaticSize="Y"
                            Size={UDim2.fromScale(1, 0)}
                            TextXAlignment="Left"
                            TextWrapped={true}
                            Text="- Feature 1"
                            TextSize={20}
                            TextYAlignment="Bottom"
                        />
                    </Div>
                </Div>
            </Div>
        </StrictMode>,
    );

    window.Enabled = true;
}
