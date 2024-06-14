import React, { useEffect, useRef, useState } from "@rbxts/react";
import InputSinker from "Components/Basic/InputSinker";
import Div from "Components/Div";
import { ToolbarButton } from "./ToolbarButton";

interface Props {
    Text: string;
    Padding: number;
    Id: number;
    SelectedId: number;
    SetSelectedId: (id: number) => void;
    Buttons: Array<{ Text: string; Order: number; OnClick: () => void }>;
}

export function ToolbarDropdownButton({ Text, Padding, Id, SelectedId, SetSelectedId, Buttons }: Props) {
    const [isHovering, setIsHovering] = useState(false);
    const [buttonWidth, setButtonWidth] = useState(0);
    const buttonRef = useRef<Frame>();

    useEffect(() => {
        if (buttonRef.current === undefined) return;
        setButtonWidth(buttonRef.current.AbsoluteSize.X);
    }, [buttonRef.current]);

    return (
        <Div
            Size={buttonWidth === 0 ? UDim2.fromScale(0, 1) : new UDim2(0, buttonWidth, 1, 0)}
            AutomaticSize={buttonWidth === 0 ? "X" : undefined}
        >
            <Div
                Size={UDim2.fromScale(0, 1)}
                AutomaticSize="X"
                BackgroundColor={isHovering || SelectedId === Id ? Color3.fromHex("2e2e2e") : undefined}
                getFrame={(frame) => {
                    buttonRef.current = frame;
                }}
            >
                <Div Size={UDim2.fromScale(0, 1)} AutomaticSize="X">
                    <uipadding PaddingLeft={new UDim(0, Padding)} PaddingRight={new UDim(0, Padding)} />

                    <textlabel
                        Size={UDim2.fromScale(0, 1)}
                        AutomaticSize={"X"}
                        BackgroundTransparency={1}
                        FontFace={new Font("SourceSans", Enum.FontWeight.Regular)}
                        TextSize={16}
                        TextColor3={Color3.fromHex("aaaaaa")}
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
                    Position={UDim2.fromScale(0, 1)}
                    AutomaticSize="XY"
                    BackgroundColor={Color3.fromHex("2e2e2e")}
                >
                    <uilistlayout FillDirection={"Vertical"} />

                    {Buttons.map((button, _) => (
                        <Div key={button.Order + 5} Size={new UDim2(1, 0, 0, 21)}>
                            <InputSinker />
                            <ToolbarButton
                                Size={UDim2.fromScale(1, 1)}
                                BackgroundColor={Color3.fromHex("252525")}
                                AutomaticTextSize={false}
                                Text={button.Text}
                                Padding={Padding}
                                OnClick={button.OnClick}
                            />
                        </Div>
                    ))}
                </Div>
            )}
        </Div>
    );
}
