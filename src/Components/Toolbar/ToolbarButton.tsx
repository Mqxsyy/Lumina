import React, { useState } from "@rbxts/react";
import Div from "Components/Div";
import StyleConfig from "Components/StyleConfig";

interface Props {
    Size?: UDim2;
    BackgroundColor?: Color3;
    AutomaticTextSize?: boolean;

    Text: string;
    OnClick?: () => void;
}

export function ToolbarButton({
    Size = UDim2.fromScale(0, 1),
    BackgroundColor = StyleConfig.Toolbar.DropdownColor,
    AutomaticTextSize = true,
    Text,
    OnClick,
}: Props) {
    const [isHovering, setIsHovering] = useState(false);

    return (
        <Div
            Size={Size}
            AutomaticSize="X"
            BackgroundColor={isHovering ? BackgroundColor : undefined}
            onHover={() => setIsHovering(true)}
            onUnhover={() => setIsHovering(false)}
            onMouseButton1Down={() => {
                if (OnClick === undefined) return;
                OnClick();
            }}
        >
            <uipadding PaddingLeft={new UDim(0, StyleConfig.Toolbar.Padding)} PaddingRight={new UDim(0, StyleConfig.Toolbar.Padding)} />

            <textlabel
                Size={AutomaticTextSize ? UDim2.fromScale(0, 1) : UDim2.fromScale(1, 1)}
                AutomaticSize={"X"}
                BackgroundTransparency={1}
                FontFace={StyleConfig.Toolbar.Font}
                TextSize={StyleConfig.Toolbar.FontSize}
                TextColor3={StyleConfig.Toolbar.FontColor}
                Text={Text}
            />
        </Div>
    );
}
