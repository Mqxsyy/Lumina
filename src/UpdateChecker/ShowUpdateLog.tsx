import React, { StrictMode } from "@rbxts/react";
import { createRoot } from "@rbxts/react-roblox";
import { BasicTextLabel } from "Components/Basic/BasicTextLabel";
import Div from "Components/Div";
import { StyleColors } from "Style";
import { GetWindow, Windows } from "Windows/WindowSevice";
import FeatureDetail from "./FeatureDetail";
import FeatureHeader from "./FeatureHeader";

export default function ShowUpdateLog() {
    const window = GetWindow(Windows.UpdateLog);
    const root = createRoot(window);

    root.render(
        <StrictMode>
            <Div BackgroundColor={StyleColors.Background}>
                <uilistlayout FillDirection="Vertical" VerticalAlignment={"Top"} Padding={new UDim(0, 20)} />
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
                    Text="Lumina Update 0.1.1"
                    FontWeight={Enum.FontWeight.ExtraBold}
                    TextSize={40}
                    TextYAlignment="Bottom"
                />
                <Div Size={UDim2.fromScale(1, 0.02)} />
                <scrollingframe
                    Size={UDim2.fromScale(1, 0)}
                    BackgroundTransparency={1}
                    BorderSizePixel={0}
                    ScrollBarThickness={4}
                    CanvasSize={UDim2.fromScale(1, 0)}
                    AutomaticCanvasSize={"Y"}
                    ScrollingDirection={"Y"}
                >
                    <uiflexitem FlexMode={Enum.UIFlexMode.Fill} />
                    <uilistlayout FillDirection="Vertical" VerticalAlignment={"Top"} Padding={new UDim(0, 20)} />

                    <FeatureHeader Text="Changes" />
                    <Div Size={UDim2.fromScale(1, 0)} AutomaticSize="Y">
                        <uilistlayout FillDirection="Vertical" VerticalAlignment={"Top"} Padding={new UDim(0, 10)} />
                        <uipadding PaddingLeft={new UDim(0, 10)} />

                        <FeatureDetail Text="- Update log no longer uses DataStores" />
                    </Div>
                </scrollingframe>
            </Div>
        </StrictMode>,
    );

    window.Enabled = true;
}
