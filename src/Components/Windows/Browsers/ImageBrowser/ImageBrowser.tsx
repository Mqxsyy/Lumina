import React, { StrictMode, useEffect, useRef, useState } from "@rbxts/react";
import { createRoot } from "@rbxts/react-roblox";
import { GetImagesFolder } from "API/FolderLocations";
import { ShallowObjectCompare } from "API/Lib";
import Div from "Components/Div";
import StudioUnlabelledTextInput from "Components/Studio/StudioUnlabelledTextInput";
import StyleConfig from "Components/StyleConfig";
import Toolbar from "Components/Toolbar/Toolbar";
import { ToolbarButton } from "Components/Toolbar/ToolbarButton";
import { ToolbarDropdown } from "Components/Toolbar/ToolbarDropdown";
import { GetWindow, Windows } from "Services/WindowSevice";
import { ReloadImageBrowser, ToggleImageBrowser, ToggleImageUploader } from "./Events";
import { type ImageData, InitializeImageEditor } from "./ImageUploader";
import UploadedImage from "./UploadedImage";

export function InitializeImageBrowser() {
    const window = GetWindow(Windows.ImageBrowser);
    window.ZIndexBehavior = Enum.ZIndexBehavior.Sibling;

    const root = createRoot(window);
    window.Enabled = true;

    ToggleImageBrowser.Connect(() => {
        window.Enabled = !window.Enabled;
    });

    root.render(
        <StrictMode>
            <ImageBrowser />
        </StrictMode>,
    );

    InitializeImageEditor();
}

function VerifyImageProperties(image: IntValue): ImageData | undefined {
    const width = image.GetAttribute("Width");
    const height = image.GetAttribute("Height");
    const columns = image.GetAttribute("Columns");
    const rows = image.GetAttribute("Rows");
    const frameCount = image.GetAttribute("FrameCount");

    if (width === undefined || height === undefined) return undefined;
    if (columns === undefined || rows === undefined) return undefined;
    if (frameCount === undefined) return undefined;

    if (!typeIs(width, "number") || !typeIs(height, "number")) return undefined;
    if (!typeIs(columns, "number") || !typeIs(rows, "number")) return undefined;
    if (!typeIs(frameCount, "number")) return undefined;

    return { id: image.Value, name: image.Name, width, height, columns, rows, frameCount };
}

function ImageBrowser() {
    const [_, setForceRender] = useState(-1);
    const [framerate, setFramerate] = useState(30);
    const [selectedDropdown, setSelectedDropdown] = useState(-1);

    const selectedImageRef = useRef<ImageData | undefined>();
    const imagesFolderRef = useRef(GetImagesFolder());

    const searchRef = useRef("");

    const images: ImageData[] = [];
    for (const [_, image] of pairs(imagesFolderRef.current.GetChildren())) {
        if (!image.IsA("IntValue")) continue;

        const imageProperties = VerifyImageProperties(image);
        if (imageProperties === undefined) continue;

        if (searchRef.current !== "") {
            if (imageProperties.name.lower().find(searchRef.current.lower())[0] === undefined) continue;
        }

        images.push(imageProperties);
    }

    const setSelectedImage = (image: ImageData | undefined) => {
        selectedImageRef.current = image;
        setForceRender((prev) => prev + 1);
    };

    const deleteImage = () => {
        const selectedImage = selectedImageRef.current;
        if (selectedImage === undefined) return;

        for (const [_, image] of pairs(imagesFolderRef.current.GetChildren())) {
            if (!image.IsA("IntValue")) continue;
            if (image.GetAttribute("Undeletable")) continue;

            const imageProperties = VerifyImageProperties(image);
            if (imageProperties === undefined) continue;
            if (!ShallowObjectCompare(selectedImage, imageProperties)) continue;

            image.Destroy();
            ReloadImageBrowser.Fire();
            break;
        }
    };

    useEffect(() => {
        const window = GetWindow(Windows.ImageBrowser);
        const connection1 = window.GetPropertyChangedSignal("AbsoluteSize").Connect(() => {
            setForceRender((prev) => prev + 1);
        });

        const connection2 = ReloadImageBrowser.Connect(() => {
            setForceRender((prev) => prev + 1);
        });

        return () => {
            connection1.Disconnect();
            connection2.Disconnect();
        };
    }, []);

    return (
        <Div BackgroundColor={StyleConfig.Studio.Colors.Darker}>
            <uilistlayout FillDirection={"Vertical"} />

            <Toolbar Window={Windows.ImageBrowser}>
                <uilistlayout FillDirection="Horizontal" HorizontalFlex={"Fill"} />

                <Div>
                    <uilistlayout FillDirection="Horizontal" HorizontalAlignment={"Left"} />

                    <ToolbarButton Text={"New"} OnClick={() => ToggleImageUploader.Fire()} />
                    <ToolbarButton Text={"Delete"} OnClick={() => deleteImage()} />
                    <ToolbarButton Text={"Refresh"} OnClick={() => ReloadImageBrowser.Fire()} />
                    <ToolbarDropdown
                        Id={1}
                        SelectedId={selectedDropdown}
                        SetSelectedId={() => setSelectedDropdown(1)}
                        Text={"Framerate"}
                        UseBorder={true}
                        Buttons={[
                            {
                                Text: "15",
                                Order: 1,
                                OnClick: () => {
                                    setFramerate(15);
                                },
                            },
                            {
                                Text: "30",
                                Order: 2,
                                OnClick: () => {
                                    setFramerate(30);
                                },
                            },
                            {
                                Text: "60",
                                Order: 3,
                                OnClick: () => {
                                    setFramerate(60);
                                },
                            },
                        ]}
                    />
                </Div>
                <Div>
                    <uilistlayout FillDirection="Horizontal" HorizontalAlignment={"Right"} />
                    <StudioUnlabelledTextInput
                        TextChanged={(text) => {
                            searchRef.current = text;
                            setForceRender((prev) => prev + 1);
                        }}
                    />
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

                <Div
                    onMouseButton1Down={() => {
                        setSelectedDropdown(-1);
                        setSelectedImage(undefined);
                    }}
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
                        images.map((image) => (
                            <UploadedImage
                                key={image.name}
                                ImageData={image}
                                SelectedImage={selectedImageRef.current}
                                Framerate={framerate}
                                MouseButton1Down={setSelectedImage}
                            />
                        ))
                    )}
                </scrollingframe>
            </Div>
        </Div>
    );
}
