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
                    Text="Lumina Update 0.1.0"
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

                    <Div Size={UDim2.fromScale(1, 0)} AutomaticSize="Y">
                        <uilistlayout FillDirection="Vertical" VerticalAlignment={"Top"} Padding={new UDim(0, 10)} />

                        <FeatureHeader Text="New Features:" />
                        <Div Size={UDim2.fromScale(1, 0)} AutomaticSize="Y">
                            <uilistlayout FillDirection="Vertical" VerticalAlignment={"Top"} Padding={new UDim(0, 5)} />
                            <uipadding PaddingLeft={new UDim(0, 10)} />

                            <FeatureDetail Text="- Now able to reorder nodes in node groups" />
                            <FeatureDetail Text="- Created update log" />
                        </Div>
                    </Div>
                    <Div Size={UDim2.fromScale(1, 0)} AutomaticSize="Y">
                        <uilistlayout FillDirection="Vertical" VerticalAlignment={"Top"} Padding={new UDim(0, 10)} />

                        <FeatureHeader Text="New Nodes:" />
                        <Div Size={UDim2.fromScale(1, 0)} AutomaticSize="Y">
                            <uilistlayout FillDirection="Vertical" VerticalAlignment={"Top"} Padding={new UDim(0, 20)} />
                            <uipadding PaddingLeft={new UDim(0, 10)} />

                            <Div Size={UDim2.fromScale(1, 0)} AutomaticSize="Y">
                                <uilistlayout FillDirection="Vertical" VerticalAlignment={"Top"} Padding={new UDim(0, 5)} />

                                <FeatureHeader Text="Initialize" FontSize={22} />
                                <Div Size={UDim2.fromScale(1, 0)} AutomaticSize="Y">
                                    <uilistlayout FillDirection="Vertical" VerticalAlignment={"Top"} Padding={new UDim(0, 5)} />
                                    <uipadding PaddingLeft={new UDim(0, 10)} />

                                    <FeatureDetail Text="- AddPositionFromShape" />
                                </Div>
                            </Div>
                            <Div Size={UDim2.fromScale(1, 0)} AutomaticSize="Y">
                                <uilistlayout FillDirection="Vertical" VerticalAlignment={"Top"} Padding={new UDim(0, 5)} />
                                <FeatureHeader Text="Render" FontSize={22} />
                                <Div Size={UDim2.fromScale(1, 0)} AutomaticSize="Y">
                                    <uilistlayout FillDirection="Vertical" VerticalAlignment={"Top"} Padding={new UDim(0, 5)} />
                                    <uipadding PaddingLeft={new UDim(0, 10)} />

                                    <FeatureDetail Text="- VolumetricParticle" />
                                    <FeatureDetail Text="- MeshParticle" />
                                </Div>
                            </Div>
                            <Div Size={UDim2.fromScale(1, 0)} AutomaticSize="Y">
                                <uilistlayout FillDirection="Vertical" VerticalAlignment={"Top"} Padding={new UDim(0, 5)} />

                                <FeatureHeader Text="Logic" FontSize={22} />
                                <Div Size={UDim2.fromScale(1, 0)} AutomaticSize="Y">
                                    <uilistlayout FillDirection="Vertical" VerticalAlignment={"Top"} Padding={new UDim(0, 5)} />
                                    <uipadding PaddingLeft={new UDim(0, 10)} />

                                    <FeatureDetail Text="- NumberInput" />
                                    <FeatureDetail Text="- Add" />
                                    <FeatureDetail Text="- Subtract" />
                                    <FeatureDetail Text="- Multiply" />
                                    <FeatureDetail Text="- Divide" />
                                    <FeatureDetail Text="- Sin" />
                                    <FeatureDetail Text="- Cos" />
                                    <FeatureDetail Text="- Tan" />
                                    <FeatureDetail Text="- Clamp" />
                                    <FeatureDetail Text="- Remap" />
                                    <FeatureDetail Text="- Time" />
                                    <FeatureDetail Text="- AliveTime" />
                                </Div>
                            </Div>
                        </Div>
                    </Div>
                    <Div Size={UDim2.fromScale(1, 0)} AutomaticSize="Y">
                        <uilistlayout FillDirection="Vertical" VerticalAlignment={"Top"} Padding={new UDim(0, 10)} />

                        <FeatureHeader Text="Other" />
                        <Div Size={UDim2.fromScale(1, 0)} AutomaticSize="Y">
                            <uilistlayout FillDirection="Vertical" VerticalAlignment={"Top"} Padding={new UDim(0, 10)} />
                            <uipadding PaddingLeft={new UDim(0, 10)} />

                            <FeatureDetail Text="- Made export auto generated code cleaner" />
                            <FeatureDetail Text="- Created discord server" />
                            <FeatureDetail Text="- Created trello page" />
                        </Div>
                    </Div>
                </scrollingframe>
            </Div>
        </StrictMode>,
    );

    window.Enabled = true;
}
