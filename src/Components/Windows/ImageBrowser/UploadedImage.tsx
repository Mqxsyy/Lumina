import React, { useEffect, useRef, useState } from "@rbxts/react";
import { RunService } from "@rbxts/services";
import { ShallowObjectCompare } from "API/Lib";
import InputSinker from "Components/Basic/InputSinker";
import Div from "Components/Div";
import StyleConfig from "Components/StyleConfig";
import type { ImageData } from "./ImageUploader";

interface Props {
    ImageData: ImageData;
    SelectedImage?: ImageData;
    Framerate: number;
    MouseButton1Down: (imageData: ImageData) => void;
}

export default function UploadedImage({ ImageData, SelectedImage, Framerate, MouseButton1Down }: Props) {
    const [isHovering, setIsHovering] = useState(false);
    const [rectOffset, setRectOffset] = useState(new Vector2(0, 0));
    const [rectSize, setRectSize] = useState(new Vector2(ImageData.width, ImageData.height));
    const animationConnectionRef = useRef<RBXScriptConnection | undefined>();

    const checkMatching = (img1: ImageData, img2?: ImageData) => {
        if (img2 === undefined) return false;
        return ShallowObjectCompare(img1, img2);
    };

    const startAnimation = () => {
        if (ImageData.frameCount < 2) return;

        print("CREAE");

        let currentFrame = 1;
        let passedTime = 0;
        const frameTime = 1 / Framerate;

        animationConnectionRef.current = RunService.RenderStepped.Connect((dt) => {
            if (passedTime < frameTime) {
                passedTime += dt;
                return;
            }

            passedTime = 0;

            if (currentFrame + 1 > ImageData.frameCount) {
                currentFrame = 1;
            } else {
                currentFrame += 1;
            }

            const row = math.floor(currentFrame / ImageData.rows);
            const column = currentFrame % ImageData.columns;

            const uvOffset = new Vector2(column / ImageData.columns, row / ImageData.rows);
            setRectOffset(new Vector2(uvOffset.X * ImageData.width, uvOffset.Y * ImageData.height));
        });

        setRectSize(new Vector2(ImageData.width / ImageData.columns, ImageData.height / ImageData.rows));
    };

    const stopAnimation = () => {
        if (animationConnectionRef.current === undefined) return;
        animationConnectionRef.current.Disconnect();
        animationConnectionRef.current = undefined;

        setRectOffset(Vector2.zero);
        setRectSize(new Vector2(ImageData.width, ImageData.height));
    };

    useEffect(() => {
        return () => {
            if (animationConnectionRef.current === undefined) return;
            animationConnectionRef.current.Disconnect();
            animationConnectionRef.current = undefined;
        };
    }, []);

    return (
        <Div
            Size={UDim2.fromOffset(100, 120)}
            BackgroundColor={isHovering || checkMatching(ImageData, SelectedImage) ? StyleConfig.Studio.Colors.DarkHighlight : undefined}
        >
            <InputSinker />

            <Div
                onHover={() => {
                    setIsHovering(true);
                    startAnimation();
                }}
                onUnhover={() => {
                    setIsHovering(false);
                    stopAnimation();
                }}
                onMouseButton1Down={() => {
                    MouseButton1Down(ImageData);
                }}
            >
                <uilistlayout FillDirection={"Vertical"} />

                <imagelabel
                    Size={UDim2.fromOffset(100, 100)}
                    BackgroundTransparency={1}
                    Image={`rbxassetid://${ImageData.id}`}
                    ImageRectOffset={rectOffset}
                    ImageRectSize={rectSize}
                />
                <textlabel
                    Size={UDim2.fromOffset(100, 20)}
                    BackgroundTransparency={1}
                    FontFace={StyleConfig.Studio.Font}
                    TextSize={StyleConfig.Studio.FontSize}
                    TextColor3={StyleConfig.Studio.FontColor}
                    Text={ImageData.name}
                />
            </Div>
        </Div>
    );
}
