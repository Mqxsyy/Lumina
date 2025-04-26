import React, { StrictMode, useEffect, useRef, useState } from "@rbxts/react";
import { createRoot } from "@rbxts/react-roblox";
import { RunService } from "@rbxts/services";
import { Event } from "API/Bindables/Event";
import type { ColorField } from "API/Fields/ColorField";
import { BasicTextLabel } from "Components/Basic/BasicTextLabel";
import { NumberInput } from "Components/Basic/NumberInput";
import { TextInput } from "Components/Basic/TextInput";
import Div from "Components/Div";
import { GetWindow, Windows } from "Services/WindowSevice";
import { StyleColors } from "API/Style";
import PickerCursor from "./PickerCursor";

// colors are bloody awful to work with due to their loss of accuracy on conversion
// also long ass file

export function InitializeColorPicker() {
    const window = GetWindow(Windows.ColorPicker);
    const root = createRoot(window);
    root.render(
        <StrictMode>
            <ColorPicker />
        </StrictMode>,
    );
}

const blackGradient = new ColorSequence([
    new ColorSequenceKeypoint(0, Color3.fromRGB(0, 0, 0)),
    new ColorSequenceKeypoint(1, Color3.fromRGB(0, 0, 0)),
]);

const hueRangeGradient = new ColorSequence([
    new ColorSequenceKeypoint(0, Color3.fromRGB(255, 0, 0)),
    new ColorSequenceKeypoint(1 / 6, Color3.fromRGB(255, 255, 0)),
    new ColorSequenceKeypoint(2 / 6, Color3.fromRGB(0, 255, 0)),
    new ColorSequenceKeypoint(3 / 6, Color3.fromRGB(0, 255, 255)),
    new ColorSequenceKeypoint(4 / 6, Color3.fromRGB(0, 0, 255)),
    new ColorSequenceKeypoint(5 / 6, Color3.fromRGB(255, 0, 255)),
    new ColorSequenceKeypoint(1, Color3.fromRGB(255, 0, 0)),
]);

const transparency = new NumberSequence([new NumberSequenceKeypoint(0, 0), new NumberSequenceKeypoint(1, 1)]);

let loadedColorPickerAPI: ColorField;
const colorPickerAPILoaded = new Event();

export function LoadColorPickerAPI(colorPicker: ColorField) {
    loadedColorPickerAPI = colorPicker;
    colorPickerAPILoaded.Fire();
}

function ColorPicker() {
    const [forceRender, setForceRender] = useState(0);

    const window = useRef<DockWidgetPluginGui>();
    const pickerAPIRef = useRef<ColorField>();
    const isDraggingCursor1Ref = useRef(false);
    const isDraggingCursor2Ref = useRef(false);

    const getRGB = () => {
        if (pickerAPIRef.current === undefined) return { R: 0, G: 0, B: 0 };

        const color = pickerAPIRef.current.GetColor();
        return { R: math.round(color.R * 255), G: math.round(color.G * 255), B: math.round(color.B * 255) };
    };

    const getHex = () => {
        if (pickerAPIRef.current === undefined) return "FFFFFF";

        const color = pickerAPIRef.current.GetColor();
        const roundedColor = Color3.fromRGB(math.round(color.R * 255), math.round(color.G * 255), math.round(color.B * 255));

        return roundedColor.ToHex();
    };

    const getCursor1Position = () => {
        if (pickerAPIRef.current === undefined || window.current === undefined) return UDim2.fromOffset(0, 0);
        if (window.current.AbsoluteSize === Vector2.zero) return UDim2.fromOffset(0, 0);

        const marginRight = 4;
        const maxX = window.current.AbsoluteSize.X * 0.8 - marginRight;
        const x = math.clamp(pickerAPIRef.current.saturation * maxX, 0, maxX);

        const marginBottom = 4;
        const maxY = window.current.AbsoluteSize.Y * 0.55 - marginBottom;
        const y = math.clamp((1 - pickerAPIRef.current.value) * maxY, 0, maxY);

        return UDim2.fromOffset(x - 4, y - 4);
    };

    const onCursor1Down = () => {
        isDraggingCursor1Ref.current = true;

        RunService.BindToRenderStep("ColorPickerCursor1", Enum.RenderPriority.Input.Value, () => {
            if (pickerAPIRef.current === undefined || window.current === undefined) return;

            const mousePosition = window.current.GetRelativeMousePosition();

            const marginLeft = 1;
            const marginRight = 4;

            const minX = window.current.AbsoluteSize.X * 0.1 + marginLeft;
            const maxX = window.current.AbsoluteSize.X * 0.8 - marginRight;
            const x = math.clamp(mousePosition.X - minX, 0, maxX);

            const marginTop = 1;
            const marginBottom = 4;

            const minY = window.current.AbsoluteSize.Y * 0.05 + marginTop;
            const maxY = window.current.AbsoluteSize.Y * 0.55 - marginBottom;
            const y = math.clamp(mousePosition.Y - minY, 0, maxY);

            pickerAPIRef.current.SetSaturation(math.clamp(x / maxX, 0, 1));
            pickerAPIRef.current.SetValue(math.clamp(1 - y / maxY, 0, 1));
        });
    };

    const onCursor1Up = () => {
        isDraggingCursor1Ref.current = false;
        RunService.UnbindFromRenderStep("ColorPickerCursor1");
    };

    const getCursor2Position = () => {
        if (pickerAPIRef.current === undefined || window.current === undefined) return UDim2.fromOffset(0, 0);
        if (window.current.AbsoluteSize === Vector2.zero) return UDim2.fromOffset(0, 0);

        const marginRight = 4;
        const maxX = window.current.AbsoluteSize.X * 0.8 - marginRight;
        const x = math.clamp(pickerAPIRef.current.hue * maxX, 0, maxX);

        return new UDim2(0, x - 4, 0.5, 0);
    };

    const onCursor2Down = () => {
        isDraggingCursor2Ref.current = true;

        RunService.BindToRenderStep("ColorPickerCursor2", Enum.RenderPriority.Input.Value, () => {
            if (pickerAPIRef.current === undefined || window.current === undefined) return;

            const mousePosition = window.current.GetRelativeMousePosition();

            const marginLeft = 1;
            const marginRight = 4;

            const minX = window.current.AbsoluteSize.X * 0.1 + marginLeft;
            const maxX = window.current.AbsoluteSize.X * 0.8 - marginRight;
            const x = math.clamp(mousePosition.X - minX, 0, maxX);

            const hue = math.clamp(x / maxX, 0, 1);
            pickerAPIRef.current.SetHue(hue);
        });
    };

    const onCursor2Up = () => {
        isDraggingCursor2Ref.current = false;
        RunService.UnbindFromRenderStep("ColorPickerCursor2");
    };

    const rChanged = (number: number) => {
        if (isDraggingCursor1Ref.current || isDraggingCursor2Ref.current || pickerAPIRef.current === undefined) return;

        let r = number;

        if (r > 255) {
            r = 255;
        }

        const oldColor = pickerAPIRef.current.GetColor();
        const newColor = Color3.fromRGB(r, math.round(oldColor.G * 255), math.round(oldColor.B * 255));
        const hsv = newColor.ToHSV();

        pickerAPIRef.current.SetHSV(hsv[0], hsv[1], hsv[2]);
        return r;
    };

    const gChanged = (number: number) => {
        if (isDraggingCursor1Ref.current || isDraggingCursor2Ref.current || pickerAPIRef.current === undefined) return;

        let g = number;

        if (g > 255) {
            g = 255;
        }

        const oldColor = pickerAPIRef.current.GetColor();
        const newColor = Color3.fromRGB(math.round(oldColor.R * 255), g, math.round(oldColor.B * 255));
        const hsv = newColor.ToHSV();

        pickerAPIRef.current.SetHSV(hsv[0], hsv[1], hsv[2]);
        return g;
    };

    const bChanged = (number: number) => {
        if (isDraggingCursor1Ref.current || isDraggingCursor2Ref.current || pickerAPIRef.current === undefined) return;

        let b = number;

        if (b > 255) {
            b = 255;
        }

        const oldColor = pickerAPIRef.current.GetColor();
        const newColor = Color3.fromRGB(math.round(oldColor.R * 255), math.round(oldColor.G * 255), b);
        const hsv = newColor.ToHSV();

        pickerAPIRef.current.SetHSV(hsv[0], hsv[1], hsv[2]);
        return b;
    };

    const hexChanged = (text: string) => {
        if (isDraggingCursor1Ref.current || isDraggingCursor2Ref.current || pickerAPIRef.current === undefined) return;

        let hex = text;

        if (hex.size() > 6) {
            hex = hex.sub(1, 6);
        }

        if (hex.size() < 6) {
            return hex;
        }

        let validatedHex = "";

        for (let i = 1; i <= 6; i++) {
            const char = hex.sub(i, i);

            if (tonumber(char, 16) === undefined) {
                validatedHex += "F";
            } else {
                validatedHex += char;
            }
        }

        const newColor = Color3.fromHex(validatedHex);
        const hsv = newColor.ToHSV();

        pickerAPIRef.current.SetHSV(hsv[0], hsv[1], hsv[2]);

        if (validatedHex.upper() !== getHex().upper()) {
            warn("Hex Color Mistranslated");
        }

        return validatedHex.upper();
    };

    const hexLostFocus = () => {
        return getHex().upper();
    };

    useEffect(() => {
        const loadedConnection = colorPickerAPILoaded.Connect(() => {
            if (loadedColorPickerAPI !== undefined) {
                pickerAPIRef.current = loadedColorPickerAPI;
                setForceRender((prev) => prev + 1);
            }
        });

        window.current = GetWindow(Windows.ColorPicker);
        const resizeConnection = window.current.GetPropertyChangedSignal("AbsoluteSize").Connect(() => {
            setForceRender((prev) => prev + 1);
        });

        return () => {
            loadedConnection.Disconnect();
            resizeConnection.Disconnect();
        };
    }, []);

    useEffect(() => {
        if (pickerAPIRef.current === undefined) return;

        const valuesChangedConnection = pickerAPIRef.current.FieldChanged.Connect(() => {
            setForceRender((prev) => prev + 1);
        });

        return () => valuesChangedConnection.Disconnect();
    }, [pickerAPIRef.current, forceRender]);

    return (
        <Div BackgroundColor={StyleColors.Background}>
            {/* Lightness And Saturation */}
            <Div
                AnchorPoint={new Vector2(0.5, 0)}
                Size={UDim2.fromScale(0.8, 0.55)}
                Position={UDim2.fromScale(0.5, 0.05)}
                BackgroundColor={Color3.fromHex("#FFFFFF")}
                onMouseButton1Down={onCursor1Down}
                onMouseButton1Up={onCursor1Up}
            >
                <uicorner CornerRadius={new UDim(0, 6)} />

                <Div BackgroundColor={StyleColors.FullWhite}>
                    <uicorner CornerRadius={new UDim(0, 6)} />
                    <uigradient
                        Color={
                            pickerAPIRef.current === undefined
                                ? blackGradient
                                : new ColorSequence([
                                      new ColorSequenceKeypoint(0, Color3.fromHSV(pickerAPIRef.current.hue, 1, 1)),
                                      new ColorSequenceKeypoint(1, Color3.fromHSV(pickerAPIRef.current.hue, 1, 1)),
                                  ])
                        }
                        Transparency={transparency}
                        Rotation={180}
                    />
                    <uistroke Color={StyleColors.Background} Thickness={1} />
                </Div>
                <Div BackgroundColor={StyleColors.FullWhite}>
                    <uicorner CornerRadius={new UDim(0, 6)} />
                    <uigradient Color={blackGradient} Transparency={transparency} Rotation={-90} />
                    <uistroke Color={StyleColors.Background} Thickness={1} />
                </Div>
                <Div>
                    <uipadding
                        PaddingTop={new UDim(0, 6)}
                        PaddingBottom={new UDim(0, 6)}
                        PaddingLeft={new UDim(0, 6)}
                        PaddingRight={new UDim(0, 6)}
                    />

                    <PickerCursor Position={getCursor1Position()} />
                </Div>
            </Div>
            {/* Hue */}
            <Div
                AnchorPoint={new Vector2(0.5, 0.5)}
                Position={UDim2.fromScale(0.5, 0.67)}
                Size={new UDim2(0.8, 0, 0, 10)}
                BackgroundColor={Color3.fromHex("#FFFFFF")}
                onMouseButton1Down={onCursor2Down}
                onMouseButton1Up={onCursor2Up}
            >
                <uicorner CornerRadius={new UDim(0, 6)} />
                <uigradient Color={hueRangeGradient} />
                <uipadding PaddingLeft={new UDim(0, 6)} PaddingRight={new UDim(0, 6)} />

                <PickerCursor Position={getCursor2Position()} />
            </Div>
            {/* Controls */}
            <Div
                AnchorPoint={new Vector2(0.5, 0)}
                Position={UDim2.fromScale(0.5, 0.75)}
                Size={UDim2.fromScale(1, 0.25)}
                BackgroundColor={StyleColors.Primary}
            >
                <uipadding
                    PaddingLeft={new UDim(0.05, 10)}
                    PaddingRight={new UDim(0.05, 10)}
                    PaddingTop={new UDim(0.05, 10)}
                    PaddingBottom={new UDim(0.05, 10)}
                />
                <uilistlayout FillDirection={"Horizontal"} Padding={new UDim(0, 10)} />

                <Div Size={UDim2.fromScale(0.8, 1)}>
                    <uilistlayout FillDirection={"Vertical"} Padding={new UDim(0, 10)} />

                    <Div Size={new UDim2(1, 0, 0.5, -5)}>
                        <uilistlayout FillDirection={"Horizontal"} Padding={new UDim(0.05, 0)} />

                        <Div Size={UDim2.fromScale(0.3, 1)}>
                            <BasicTextLabel Size={UDim2.fromScale(0.2, 1)} Text={"R: "} IsAffectedByZoom={false} />
                            <NumberInput
                                Position={UDim2.fromScale(0.25, 0)}
                                Size={UDim2.fromScale(0.75, 1)}
                                Text={() => tostring(getRGB().R)}
                                NumberChanged={rChanged}
                                IsAffectedByZoom={false}
                            />
                        </Div>
                        <Div Size={UDim2.fromScale(0.3, 1)}>
                            <BasicTextLabel Size={UDim2.fromScale(0.2, 1)} Text={"G: "} IsAffectedByZoom={false} />
                            <NumberInput
                                Position={UDim2.fromScale(0.25, 0)}
                                Size={UDim2.fromScale(0.75, 1)}
                                Text={() => tostring(getRGB().G)}
                                NumberChanged={gChanged}
                                IsAffectedByZoom={false}
                            />
                        </Div>
                        <Div Size={UDim2.fromScale(0.3, 1)}>
                            <BasicTextLabel Size={UDim2.fromScale(0.2, 1)} Text={"B: "} IsAffectedByZoom={false} />
                            <NumberInput
                                Position={UDim2.fromScale(0.25, 0)}
                                Size={UDim2.fromScale(0.75, 1)}
                                Text={() => tostring(getRGB().B)}
                                NumberChanged={bChanged}
                                IsAffectedByZoom={false}
                            />
                        </Div>
                    </Div>
                    <Div Position={UDim2.fromScale(0.2, 0)} Size={new UDim2(0.6, 0, 0.5, -5)}>
                        <BasicTextLabel Size={UDim2.fromScale(0.2, 1)} Text={"Hex: "} IsAffectedByZoom={false} />
                        <TextInput
                            Position={UDim2.fromScale(0.25, 0)}
                            Size={UDim2.fromScale(0.75, 1)}
                            Text={() => getHex().upper()}
                            TextChanged={hexChanged}
                            LostFocus={hexLostFocus}
                            IsAffectedByZoom={false}
                        />
                    </Div>
                </Div>
                <Div
                    Size={new UDim2(0.2, -10, 1, 0)}
                    BackgroundColor={pickerAPIRef.current === undefined ? StyleColors.FullWhite : pickerAPIRef.current.GetColor()}
                />
            </Div>
        </Div>
    );
}
