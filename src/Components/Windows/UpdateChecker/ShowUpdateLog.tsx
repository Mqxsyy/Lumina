import React, { StrictMode } from "@rbxts/react";
import { createRoot } from "@rbxts/react-roblox";
import { BasicTextLabel } from "Components/Basic/BasicTextLabel";
import Div from "Components/Div";
import { GetWindow, Windows } from "Services/WindowSevice";
import { StyleColors } from "API/Style";
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
                    Text="Lumina Update 0.2.0"
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
                        <uilistlayout FillDirection="Vertical" VerticalAlignment={"Top"} Padding={new UDim(0, 20)} />

                        <FeatureHeader Text="New Features" />
                        <Div Size={UDim2.fromScale(1, 0)} AutomaticSize="Y">
                            <uilistlayout FillDirection="Vertical" VerticalAlignment={"Top"} Padding={new UDim(0, 10)} />
                            <uipadding PaddingLeft={new UDim(0, 10)} />

                            <FeatureDetail Text="- Connection support for Vector2 and Vector3" />
                            <FeatureDetail Text="- Some nodes work in both Initialize and Update groups" />
                            <FeatureDetail Text="- LineGraph now has a negative area, max and min values can be changed" />
                            <FeatureDetail Text="- Vector2 and Vector3 fields can now be collapsed" />
                        </Div>
                    </Div>

                    <Div Size={UDim2.fromScale(1, 0)} AutomaticSize="Y">
                        <uilistlayout FillDirection="Vertical" VerticalAlignment={"Top"} Padding={new UDim(0, 20)} />

                        <FeatureHeader Text="Node Changes" />
                        <Div Size={UDim2.fromScale(1, 0)} AutomaticSize="Y">
                            <uilistlayout FillDirection="Vertical" VerticalAlignment={"Top"} Padding={new UDim(0, 10)} />
                            <uipadding PaddingLeft={new UDim(0, 10)} />

                            <FeatureDetail Text="- Added an option for two ranges to RandomNumber" />
                            <FeatureDetail Text="- Added delay property to BurstSpawn" />
                            <Div Size={UDim2.fromScale(1, 0)} AutomaticSize="Y">
                                <uilistlayout FillDirection="Vertical" VerticalAlignment={"Top"} Padding={new UDim(0, 10)} />

                                <FeatureDetail Text={`- Renamed "Add Position From Shape" to "Shape"`} />
                                <FeatureDetail Text="	- Moved to logic nodes" />
                            </Div>
                            <Div Size={UDim2.fromScale(1, 0)} AutomaticSize="Y">
                                <uilistlayout FillDirection="Vertical" VerticalAlignment={"Top"} Padding={new UDim(0, 10)} />

                                <FeatureDetail Text={`- Renamed "NumberOut" to "ValueOut"`} />
                                <FeatureDetail Text="	- Has options for Vector2 and Vector3" />
                            </Div>
                            <Div Size={UDim2.fromScale(1, 0)} AutomaticSize="Y">
                                <uilistlayout FillDirection="Vertical" VerticalAlignment={"Top"} Padding={new UDim(0, 10)} />

                                <FeatureDetail Text="- Combined some nodes" />
                                <FeatureDetail Text="	- Add, Subtract, Multiply, Divide" />
                                <FeatureDetail Text="	- Sin, Cos, Tan" />
                                <FeatureDetail Text="	- Lifetime" />
                                <FeatureDetail Text="	- Size" />
                                <FeatureDetail Text="	- Rotation" />
                                <FeatureDetail Text="	- Velocity" />
                            </Div>
                            <FeatureDetail Text="- Removed SetPositionToParent (use GetParentProperty instead)" />
                        </Div>
                    </Div>

                    <Div Size={UDim2.fromScale(1, 0)} AutomaticSize="Y">
                        <uilistlayout FillDirection="Vertical" VerticalAlignment={"Top"} Padding={new UDim(0, 20)} />

                        <FeatureHeader Text="New Nodes" />
                        <Div Size={UDim2.fromScale(1, 0)} AutomaticSize="Y">
                            <uilistlayout FillDirection="Vertical" VerticalAlignment={"Top"} Padding={new UDim(0, 10)} />
                            <uipadding PaddingLeft={new UDim(0, 10)} />

                            <FeatureDetail Text="- Bounce" />
                            <FeatureDetail Text="- Direct Velocity" />
                            <FeatureDetail Text="- Move Towards" />
                            <FeatureDetail Text="- Look Towards" />
                            <FeatureDetail Text="- Get Parent Property" />
                            <FeatureDetail Text="- Vector Math" />
                            <FeatureDetail Text="- Multiply Rotation Over Life" />
                        </Div>
                    </Div>

                    <Div Size={UDim2.fromScale(1, 0)} AutomaticSize="Y">
                        <uilistlayout FillDirection="Vertical" VerticalAlignment={"Top"} Padding={new UDim(0, 20)} />

                        <FeatureHeader Text="Bug Fixes" />
                        <Div Size={UDim2.fromScale(1, 0)} AutomaticSize="Y">
                            <uilistlayout FillDirection="Vertical" VerticalAlignment={"Top"} Padding={new UDim(0, 10)} />
                            <uipadding PaddingLeft={new UDim(0, 10)} />

                            <FeatureDetail Text="- Node reordering was only visual" />
                            <FeatureDetail Text="- Node reordering works a bit better" />
                            <FeatureDetail Text="- MeshParticle spitesheet wasn't working" />
                        </Div>
                    </Div>

                    <Div Size={UDim2.fromScale(1, 0)} AutomaticSize="Y">
                        <uilistlayout FillDirection="Vertical" VerticalAlignment={"Top"} Padding={new UDim(0, 20)} />

                        <FeatureHeader Text="Extra" />
                        <Div Size={UDim2.fromScale(1, 0)} AutomaticSize="Y">
                            <uilistlayout FillDirection="Vertical" VerticalAlignment={"Top"} Padding={new UDim(0, 10)} />
                            <uipadding PaddingLeft={new UDim(0, 10)} />

                            <FeatureDetail Text="- Connections now have a static start and end length" />
                            <FeatureDetail Text="- Auto generation looks better" />
                            <FeatureDetail Text="- Changed how saves are handled (old savedata is now broken)" />
                        </Div>
                    </Div>
                </scrollingframe>
            </Div>
        </StrictMode>,
    );

    window.Enabled = true;
}
