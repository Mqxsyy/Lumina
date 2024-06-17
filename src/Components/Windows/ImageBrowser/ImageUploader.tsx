import React, { StrictMode } from "@rbxts/react";
import { createRoot } from "@rbxts/react-roblox";
import Div from "Components/Div";
import StyleConfig from "Components/StyleConfig";
import { GetWindow, Windows } from "Services/WindowSevice";

export function InitializeImageEditor() {
    const window = GetWindow(Windows.ImageEditor);
    window.ZIndexBehavior = Enum.ZIndexBehavior.Sibling;

    const root = createRoot(window);
    window.Enabled = true;

    root.render(
        <StrictMode>
            <ImageEditor />
        </StrictMode>,
    );
}

export interface ImageData {
    name: string;
    id: number;
}

interface InputProps {
    Title: string;
    Placeholder?: string;
}

function Input({ Title, Placeholder = "" }: InputProps) {
    return (
        <Div Size={UDim2.fromScale(1, 0)} AutomaticSize="Y">
            <uilistlayout FillDirection={"Horizontal"} Padding={new UDim(0, 5)} />

            <textlabel
                Size={UDim2.fromOffset(0, 20)}
                AutomaticSize={"X"}
                BackgroundTransparency={1}
                TextColor3={StyleConfig.Studio.FontColor}
                TextSize={StyleConfig.Studio.FontSize}
                FontFace={StyleConfig.Studio.Font}
                Text={`${Title}:`}
                TextXAlignment={"Left"}
            />
            <Div Size={UDim2.fromOffset(0, 20)} BackgroundColor={StyleConfig.Studio.ColorDarkest}>
                <uiflexitem FlexMode={"Fill"} />
                <uipadding PaddingLeft={new UDim(0, 5)} PaddingRight={new UDim(0, 5)} />

                <textbox
                    Size={UDim2.fromScale(1, 1)}
                    BackgroundTransparency={1}
                    TextColor3={StyleConfig.Studio.FontColor}
                    TextSize={StyleConfig.Studio.FontSize}
                    FontFace={StyleConfig.Studio.Font}
                    TextXAlignment={"Left"}
                    Text={""}
                    PlaceholderText={Placeholder}
                    PlaceholderColor3={StyleConfig.Studio.FontColorPlaceholder}
                    TextTruncate={"AtEnd"}
                    ClearTextOnFocus={false}
                />
            </Div>
        </Div>
    );
}

function ImageEditor() {
    return (
        <Div BackgroundColor={StyleConfig.Studio.ColorDarker}>
            <uipadding PaddingLeft={new UDim(0, 10)} PaddingRight={new UDim(0, 10)} />
            <uilistlayout FillDirection={"Horizontal"} Padding={new UDim(0, 20)} />

            <Div Size={UDim2.fromScale(0, 1)} AutomaticSize="X">
                <imagelabel
                    AnchorPoint={new Vector2(0, 0.5)}
                    Position={UDim2.fromScale(0, 0.5)}
                    Size={UDim2.fromOffset(200, 200)}
                    // BackgroundTransparency={1}
                />
            </Div>
            <Div Size={UDim2.fromScale(0, 1)}>
                <uilistlayout FillDirection={"Vertical"} VerticalAlignment={"Center"} Padding={new UDim(0, 5)} />
                <uiflexitem FlexMode={"Fill"} />

                <Div Size={UDim2.fromScale(1, 0)} AutomaticSize="Y">
                    <uilistlayout FillDirection={"Vertical"} VerticalAlignment={"Center"} Padding={new UDim(0, 5)} />

                    <textlabel
                        Size={new UDim2(1, 0, 0, 20)}
                        BackgroundTransparency={1}
                        TextColor3={StyleConfig.Studio.FontColor}
                        TextSize={StyleConfig.Studio.FontSize}
                        FontFace={StyleConfig.Studio.FontSemiBold}
                        Text="Main Options"
                        TextXAlignment={"Left"}
                    />

                    <Input Title="Image Id" />
                    <Input Title="Name" />
                </Div>

                <Div Size={new UDim2(1, 0, 0, 10)} />

                <Div Size={UDim2.fromScale(1, 0)} AutomaticSize="Y">
                    <uilistlayout FillDirection={"Vertical"} VerticalAlignment={"Center"} Padding={new UDim(0, 5)} />

                    <textlabel
                        Size={new UDim2(1, 0, 0, 20)}
                        BackgroundTransparency={1}
                        TextColor3={StyleConfig.Studio.FontColor}
                        TextSize={StyleConfig.Studio.FontSize}
                        FontFace={StyleConfig.Studio.FontSemiBold}
                        Text="SpriteSheet Options"
                        TextXAlignment={"Left"}
                    />

                    <Input Title={"Image Width (px)"} Placeholder={"1024"} />
                    <Input Title={"Image Height (px)"} Placeholder={"1024"} />
                    <Input Title={"Columns"} Placeholder={"1"} />
                    <Input Title={"Rows"} Placeholder={"1"} />
                    <Input Title={"Frame Count"} Placeholder={"1"} />
                </Div>

                <Div Size={new UDim2(1, 0, 0, 10)} />
            </Div>
        </Div>
    );
}
