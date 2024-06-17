import React, { useState } from "@rbxts/react";
import Div from "Components/Div";
import StyleConfig from "Components/StyleConfig";

interface Props {
    Name: string;
    ImageId: number;
}

export default function UploadedImage({ Name, ImageId }: Props) {
    const [isHovering, setIsHovering] = useState(false);

    return (
        <Div
            Size={UDim2.fromOffset(100, 120)}
            BackgroundColor={isHovering ? StyleConfig.Studio.ColorDarkHighlight : undefined}
            onHover={() => setIsHovering(true)}
            onUnhover={() => setIsHovering(false)}
        >
            <uilistlayout FillDirection={"Vertical"} />

            <imagelabel Size={UDim2.fromOffset(100, 100)} BackgroundTransparency={1} Image={`rbxassetid://${ImageId}`} />
            <textlabel
                Size={UDim2.fromOffset(100, 20)}
                BackgroundTransparency={1}
                FontFace={StyleConfig.Studio.Font}
                TextSize={StyleConfig.Studio.FontSize}
                TextColor3={StyleConfig.Studio.FontColor}
                Text={Name}
            />
        </Div>
    );
}
