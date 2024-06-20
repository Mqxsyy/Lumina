import React, { useState } from "@rbxts/react";
import Div from "Components/Div";
import StyleConfig from "Components/StyleConfig";

interface Props {
    Text: string;
    OnClick: () => void;
}

export default function ToolbarDropdownButton({ Text, OnClick }: Props) {
    const [isHovering, setIsHovering] = useState(false);

    return (
        <Div Size={UDim2.fromScale(0, 1)} AutomaticSize="X" BackgroundColor={isHovering ? Color3.fromHex("252525") : undefined}>
            <textlabel
                Size={UDim2.fromScale(1, 1)}
                AutomaticSize={"X"}
                BackgroundTransparency={1}
                FontFace={StyleConfig.Studio.Font}
                TextSize={StyleConfig.Studio.FontSize}
                TextColor3={StyleConfig.Studio.FontColor}
                Text={Text}
                Event={{
                    MouseEnter: () => setIsHovering(true),
                    MouseLeave: () => setIsHovering(false),
                    InputBegan: (_, input) => {
                        if (input.UserInputType === Enum.UserInputType.MouseButton1) {
                            if (OnClick === undefined) return;
                            OnClick();
                        }
                    },
                }}
            />
        </Div>
    );
}
