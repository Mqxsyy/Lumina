import React, { StrictMode, useEffect, useState } from "@rbxts/react";
import { createRoot } from "@rbxts/react-roblox";
import { GetImagesFolder } from "API/FolderLocations";
import Div from "Components/Div";
import StyleConfig from "Components/StyleConfig";
import Toolbar from "Components/Toolbar/Toolbar";
import { ToolbarButton } from "Components/Toolbar/ToolbarButton";
import { GetWindow, Windows } from "Services/WindowSevice";
import { type ImageData, InitializeImageEditor } from "./ImageUploader";
import UploadedImage from "./UploadedImage";

export function InitializeImageBrowser() {
    const window = GetWindow(Windows.ImageBrowser);
    window.ZIndexBehavior = Enum.ZIndexBehavior.Sibling;

    const root = createRoot(window);
    window.Enabled = true;

    root.render(
        <StrictMode>
            <ImageBrowser />
        </StrictMode>,
    );

    InitializeImageEditor();
}

function ImageBrowser() {
    const [_, setForceRender] = useState(-1);
    const [images, setImages] = useState<ImageData[]>([]);

    useEffect(() => {
        const window = GetWindow(Windows.ImageBrowser);
        const connection = window.GetPropertyChangedSignal("AbsoluteSize").Connect(() => {
            setForceRender((prev) => prev + 1);
        });

        const imagesFolder = GetImagesFolder();
        const foundImages: ImageData[] = [];
        for (const [_, image] of pairs(imagesFolder.GetChildren())) {
            if (!image.IsA("NumberValue")) continue;
            foundImages.push({ name: image.Name, id: image.Value });
        }

        if (foundImages.size() > 0) {
            setImages(foundImages);
        }

        return () => {
            connection.Disconnect();
        };
    }, []);

    return (
        <Div BackgroundColor={StyleConfig.Studio.ColorDarker}>
            <uilistlayout FillDirection={"Vertical"} />

            <Toolbar Window={Windows.ImageBrowser}>
                <uilistlayout FillDirection="Horizontal" HorizontalFlex={"Fill"} />

                <Div>
                    <uilistlayout FillDirection="Horizontal" HorizontalAlignment={"Left"} />

                    <ToolbarButton Text={"New"} />
                    <ToolbarButton Text={"Delete"} />
                </Div>
                <Div>
                    <uilistlayout FillDirection="Horizontal" HorizontalAlignment={"Right"} />

                    <Div Size={UDim2.fromScale(0.75, 1)} BackgroundColor={StyleConfig.Studio.ColorDarkest}>
                        <uipadding PaddingLeft={new UDim(0, 5)} PaddingRight={new UDim(0, 5)} />

                        <textbox
                            Size={UDim2.fromScale(1, 1)}
                            BackgroundTransparency={1}
                            TextColor3={StyleConfig.Studio.FontColor}
                            TextSize={StyleConfig.Studio.FontSize}
                            FontFace={StyleConfig.Studio.Font}
                            TextXAlignment={"Left"}
                            Text={""}
                            PlaceholderText={"Search"}
                            PlaceholderColor3={StyleConfig.Studio.FontColorPlaceholder}
                            TextTruncate={"AtEnd"}
                            ClearTextOnFocus={false}
                        />
                    </Div>
                </Div>
            </Toolbar>

            <Div Size={UDim2.fromScale(1, 0)}>
                <uiflexitem FlexMode={"Fill"} />
                <uipadding
                    PaddingBottom={new UDim(0, 5)}
                    PaddingLeft={new UDim(0, 5)}
                    PaddingRight={new UDim(0, 5)}
                    PaddingTop={new UDim(0, 5)}
                />

                <scrollingframe
                    Size={UDim2.fromScale(1, 1)}
                    BackgroundTransparency={1}
                    BorderSizePixel={0}
                    ScrollBarImageColor3={StyleConfig.Studio.FontColor}
                    ScrollBarThickness={4}
                    ScrollingDirection={"Y"}
                    CanvasSize={UDim2.fromScale(0, 0)}
                    AutomaticCanvasSize={"Y"}
                >
                    <uilistlayout FillDirection={"Horizontal"} Padding={new UDim(0, 5)} Wraps={true} />

                    {images.size() === 0 ? (
                        <textlabel
                            Size={UDim2.fromScale(1, 1)}
                            BackgroundTransparency={1}
                            TextColor3={StyleConfig.Studio.FontColorPlaceholder}
                            TextSize={StyleConfig.Studio.FontSize}
                            FontFace={StyleConfig.Studio.Font}
                            Text="No Images Found"
                        />
                    ) : (
                        images.map((image) => <UploadedImage key={image.name} Name={image.name} ImageId={image.id} />)
                    )}
                </scrollingframe>
            </Div>
        </Div>
    );
}
