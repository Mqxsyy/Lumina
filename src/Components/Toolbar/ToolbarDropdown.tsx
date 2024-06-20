import React, { useEffect, useRef, useState } from "@rbxts/react";
import InputSinker from "Components/Basic/InputSinker";
import Div from "Components/Div";
import StyleConfig from "Components/StyleConfig";
import { ToolbarButton } from "./ToolbarButton";

interface Props {
    Text: string;
    Id: number;
    SelectedId: number;
    UseBorder?: boolean;
    SetSelectedId: (id: number) => void;
    Buttons: Array<{ Text: string; Order: number; OnClick: () => void }>;
}

export function ToolbarDropdown({ Text, Id, SelectedId, UseBorder = false, SetSelectedId, Buttons }: Props) {
    const [isHovering, setIsHovering] = useState(false);
    const [buttonWidth, setButtonWidth] = useState(0);
    const buttonRef = useRef<Frame>();

    useEffect(() => {
        const button = buttonRef.current as Frame;
        setButtonWidth(button.AbsoluteSize.X);
    }, []);

    return (
        <Div
            Size={buttonWidth === 0 ? UDim2.fromScale(0, 1) : new UDim2(0, buttonWidth, 1, 0)}
            AutomaticSize={buttonWidth === 0 ? "X" : undefined}
        >
            <Div
                Size={UDim2.fromScale(0, 1)}
                AutomaticSize="X"
                BackgroundColor={isHovering || SelectedId === Id ? StyleConfig.Studio.Colors.Darker : undefined}
                getFrame={(frame) => {
                    buttonRef.current = frame;
                }}
            >
                <Div Size={UDim2.fromScale(0, 1)} AutomaticSize="X">
                    <uipadding
                        PaddingLeft={new UDim(0, StyleConfig.Studio.Padding)}
                        PaddingRight={new UDim(0, StyleConfig.Studio.Padding)}
                    />

                    <textlabel
                        Size={UDim2.fromScale(0, 1)}
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
                                    if (SelectedId === Id) {
                                        SetSelectedId(-1);
                                    } else {
                                        SetSelectedId(Id);
                                    }
                                }
                            },
                        }}
                    />
                </Div>
            </Div>
            {SelectedId === Id && (
                <Div
                    Size={UDim2.fromOffset(0, 0)}
                    Position={UseBorder ? new UDim2(0, 1, 1, 0) : UDim2.fromScale(0, 1)}
                    AutomaticSize="XY"
                    BackgroundColor={StyleConfig.Studio.Colors.Darker}
                    BorderSize={UseBorder ? 1 : 0}
                    BorderColor={StyleConfig.Studio.Colors.Border}
                    ZIndex={0}
                >
                    <uilistlayout FillDirection={"Vertical"} />

                    {Buttons.map((button, _) => (
                        <Div key={button.Order + 5} Size={new UDim2(1, 0, 0, 21)}>
                            <InputSinker />
                            <ToolbarButton
                                Size={UDim2.fromScale(1, 1)}
                                BackgroundColor={StyleConfig.Studio.Colors.Darkest}
                                AutomaticTextSize={false}
                                Text={button.Text}
                                OnClick={button.OnClick}
                            />
                        </Div>
                    ))}
                </Div>
            )}
        </Div>
    );
}
