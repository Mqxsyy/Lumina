import React, { useState } from "@rbxts/react";
import InputSinker from "Components/Basic/InputSinker";
import Div from "Components/Div";

interface Props {
    Size?: UDim2;
    BackgroundColor?: Color3;
    AutomaticTextSize?: boolean;

    Text: string;
    Padding: number;
    OnClick?: () => void;
}

export function ToolbarButton({
    Size = UDim2.fromScale(0, 1),
    BackgroundColor = Color3.fromHex("2e2e2e"),
    AutomaticTextSize = true,
    Text,
    Padding,
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
            <uipadding PaddingLeft={new UDim(0, Padding)} PaddingRight={new UDim(0, Padding)} />

            <textlabel
                Size={AutomaticTextSize ? UDim2.fromScale(0, 1) : UDim2.fromScale(1, 1)}
                AutomaticSize={"X"}
                BackgroundTransparency={1}
                FontFace={new Font("SourceSans", Enum.FontWeight.Regular)}
                TextSize={16}
                TextColor3={Color3.fromHex("aaaaaa")}
                Text={Text}
            />
        </Div>
    );
}
