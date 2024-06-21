import React, { useEffect, useRef } from "@rbxts/react";
import Div from "Components/Div";
import StyleConfig from "Components/StyleConfig";

interface Props {
    TextChanged: (text: string) => void;
}

export default function StudioUnlabelledTextInput({ TextChanged }: Props) {
    const searchElementRef = useRef<TextBox>();

    useEffect(() => {
        const textBox = searchElementRef.current as TextBox;
        const connection = textBox.GetPropertyChangedSignal("Text").Connect(() => {
            TextChanged(textBox.Text);
        });

        return () => {
            connection.Disconnect();
        };
    }, []);

    return (
        <Div Size={UDim2.fromScale(0.75, 1)} BackgroundColor={StyleConfig.Studio.Colors.Darkest}>
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
                ref={searchElementRef}
            />
        </Div>
    );
}
