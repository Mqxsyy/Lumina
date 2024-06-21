import React, { useState } from "@rbxts/react";
import Div from "Components/Div";
import StyleConfig from "Components/StyleConfig";

interface Props {
    MouseButton1Down: () => void;
}

export default function StudioPrimaryButton({ MouseButton1Down }: Props) {
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
