import React, { StrictMode, useEffect, useRef, useState } from "@rbxts/react";
import { createRoot } from "@rbxts/react-roblox";
import { GetImagesFolder } from "API/FolderLocations";
import type { JSObject } from "API/Lib";
import Div from "Components/Div";
import StyleConfig from "Components/StyleConfig";
import { GetWindow, Windows } from "Services/WindowSevice";
import { ReloadImageBrowser, ToggleImageUploader } from "./Events";

export function InitializeImageEditor() {
    const window = GetWindow(Windows.ImageEditor);
    window.ZIndexBehavior = Enum.ZIndexBehavior.Sibling;

    const root = createRoot(window);
    window.Enabled = false;

    ToggleImageUploader.Connect(() => {
        window.Enabled = !window.Enabled;
    });

    root.render(
        <StrictMode>
            <ImageEditor />
        </StrictMode>,
    );
}

export interface ImageData extends JSObject {
    id: number;
    name: string;

    width: number;
    height: number;
    columns: number;
    rows: number;
    frameCount: number;
}

interface InputProps {
    Title: string;
    Placeholder?: string;
    TextChanged?: (text: string) => void;
}

function Input({ Title, Placeholder = "", TextChanged }: InputProps) {
    const textBoxRef = useRef<TextBox>();

    useEffect(() => {
        const textbox = textBoxRef.current as TextBox;

        const conneciton = textbox.GetPropertyChangedSignal("Text").Connect(() => {
            if (TextChanged === undefined) return;
            TextChanged(textbox.Text);
        });

        return () => {
            conneciton.Disconnect();
        };
    }, []);

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
            <Div Size={UDim2.fromOffset(0, 20)} BackgroundColor={StyleConfig.Studio.Colors.Darkest}>
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
                    ref={textBoxRef}
                />
            </Div>
        </Div>
    );
}

interface CreateButtonProps {
    MouseButton1Down: () => void;
}

function CreateButton({ MouseButton1Down }: CreateButtonProps) {
    const [color, setColor] = useState(StyleConfig.Studio.Colors.ButtonPrimary);

    return (
        <Div
            Size={UDim2.fromOffset(0, 0)}
            AutomaticSize="XY"
            BackgroundColor={color}
            onHover={() => setColor(StyleConfig.Studio.Colors.ButtonPrimaryHighlight)}
            onUnhover={() => setColor(StyleConfig.Studio.Colors.ButtonPrimary)}
            onMouseButton1Down={MouseButton1Down}
        >
            <uipadding
                PaddingLeft={new UDim(0, 10)}
                PaddingRight={new UDim(0, 10)}
                PaddingTop={new UDim(0, 3)}
                PaddingBottom={new UDim(0, 3)}
            />
            <uicorner CornerRadius={new UDim(0, 5)} />

            <textlabel
                Size={UDim2.fromOffset(0, 0)}
                AutomaticSize={"XY"}
                BackgroundTransparency={1}
                TextColor3={Color3.fromHex("FFFFFF")}
                TextSize={StyleConfig.Studio.FontSize}
                FontFace={StyleConfig.Studio.FontBold}
                Text={"Create"}
            />
        </Div>
    );
}

function ImageEditor() {
    const [_, setForceRender] = useState(0);

    const imageIdRef = useRef("18120836907");
    const imageNameRef = useRef("");

    const imageWidthRef = useRef("1024");
    const imageHeightRef = useRef("1024");
    const imageColumnsRef = useRef("1");
    const imageRowsRef = useRef("1");
    const imageFrameCountRef = useRef("1");

    const CreateImage = () => {
        if (imageIdRef.current === "" || tonumber(imageIdRef.current) === undefined || imageIdRef.current === "18120836907") return;
        if (imageNameRef.current === "") return;

        if (imageWidthRef.current !== "1024" && tonumber(imageWidthRef.current) === undefined) return;
        if (imageHeightRef.current !== "1024" && tonumber(imageHeightRef.current) === undefined) return;
        if (imageColumnsRef.current !== "1" && tonumber(imageColumnsRef.current) === undefined) return;
        if (imageRowsRef.current !== "1" && tonumber(imageRowsRef.current) === undefined) return;
        if (imageFrameCountRef.current !== "1" && tonumber(imageFrameCountRef.current) === undefined) return;

        const imagesFolder = GetImagesFolder();

        const uploadedImage = new Instance("IntValue");
        uploadedImage.Name = imageNameRef.current;
        uploadedImage.Value = tonumber(imageIdRef.current) as number;

        uploadedImage.SetAttribute("Width", tonumber(imageWidthRef.current));
        uploadedImage.SetAttribute("Height", tonumber(imageHeightRef.current));
        uploadedImage.SetAttribute("Columns", tonumber(imageColumnsRef.current));
        uploadedImage.SetAttribute("Rows", tonumber(imageRowsRef.current));
        uploadedImage.SetAttribute("FrameCount", tonumber(imageFrameCountRef.current));

        uploadedImage.Parent = imagesFolder;

        ReloadImageBrowser.Fire();
        ToggleImageUploader.Fire();
    };

    return (
        <Div BackgroundColor={StyleConfig.Studio.Colors.Darker}>
            <uipadding PaddingLeft={new UDim(0, 10)} PaddingRight={new UDim(0, 10)} />
            <uilistlayout FillDirection={"Horizontal"} Padding={new UDim(0, 20)} />

            <Div Size={UDim2.fromScale(0, 1)} AutomaticSize="X">
                <imagelabel
                    AnchorPoint={new Vector2(0, 0.5)}
                    Position={UDim2.fromScale(0, 0.5)}
                    Size={UDim2.fromOffset(200, 200)}
                    BackgroundTransparency={1}
                    Image={`rbxassetid://${imageIdRef.current}`}
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

                    <Input
                        Title="Image Id"
                        TextChanged={(text) => {
                            if (text === "") {
                                imageIdRef.current = "18120836907";
                            } else {
                                imageIdRef.current = text;
                            }

                            setForceRender((prev) => prev + 1);
                        }}
                    />
                    <Input
                        Title="Name"
                        TextChanged={(text) => {
                            imageNameRef.current = text;
                        }}
                    />
                </Div>

                <Div Size={new UDim2(1, 0, 0, 5)} />

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

                    <Input
                        Title={"Image Width (px)"}
                        Placeholder={"1024"}
                        TextChanged={(text) => {
                            if (text === "") {
                                imageWidthRef.current = "1024";
                                return;
                            }

                            imageWidthRef.current = text;
                        }}
                    />
                    <Input
                        Title={"Image Height (px)"}
                        Placeholder={"1024"}
                        TextChanged={(text) => {
                            if (text === "") {
                                imageHeightRef.current = "1024";
                                return;
                            }

                            imageHeightRef.current = text;
                        }}
                    />
                    <Input
                        Title={"Columns"}
                        Placeholder={"1"}
                        TextChanged={(text) => {
                            if (text === "") {
                                imageColumnsRef.current = "1024";
                                return;
                            }

                            imageColumnsRef.current = text;
                        }}
                    />
                    <Input
                        Title={"Rows"}
                        Placeholder={"1"}
                        TextChanged={(text) => {
                            if (text === "") {
                                imageRowsRef.current = "1024";
                                return;
                            }

                            imageRowsRef.current = text;
                        }}
                    />
                    <Input
                        Title={"Frame Count"}
                        Placeholder={"1"}
                        TextChanged={(text) => {
                            if (text === "") {
                                imageFrameCountRef.current = "1024";
                                return;
                            }

                            imageFrameCountRef.current = text;
                        }}
                    />
                </Div>

                <Div Size={new UDim2(1, 0, 0, 5)} />

                <Div Size={UDim2.fromScale(1, 0)} AutomaticSize="Y">
                    <uilistlayout FillDirection={"Horizontal"} HorizontalAlignment={"Right"} />
                    <CreateButton MouseButton1Down={CreateImage} />
                </Div>
            </Div>
        </Div>
    );
}
