import React, { useRef, useEffect } from "@rbxts/react";
import Div from "Components/Div";
import StyleConfig from "Components/StyleConfig";

interface Props {
    Title: string;
    Placeholder?: string;
    TextChanged?: (text: string) => void;
}

export default function StudioLabelledTextInput({ Title, Placeholder = "", TextChanged }: Props) {
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
