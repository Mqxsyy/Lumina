import React, { useEffect, useRef, useState } from "@rbxts/react";
import type { ColorField } from "API/Fields/ColorField";
import { BasicTextLabel } from "Components/Basic/BasicTextLabel";
import Div from "Components/Div";
import { LoadColorPickerAPI } from "Components/Windows/Pickers.tsx/ColorPicker";
import { GetWindow, Windows } from "Services/WindowSevice";
import { StyleProperties } from "API/Style";
import { GetZoomScale } from "ZoomScale";

interface Props {
    Label: string;
    ColorPicker: ColorField;
}

export function ColorPickerField({ Label, ColorPicker }: Props) {
    const windowRef = useRef(GetWindow(Windows.ColorPicker));
    const [_, setForceRender] = useState(0);

    const zoomScale = GetZoomScale();

    useEffect(() => {
        const connection = ColorPicker.FieldChanged.Connect(() => {
            setForceRender((prev) => prev + 1);
        });

        return () => connection.Disconnect();
    }, []);

    const OnMouseButton1Down = () => {
        windowRef.current.Enabled = !windowRef.current.Enabled;
        LoadColorPickerAPI(ColorPicker);
    };

    return (
        <Div Size={UDim2.fromScale(1, 0)} AutomaticSize="Y">
            <uilistlayout FillDirection="Horizontal" VerticalAlignment={"Center"} Padding={new UDim(0, 10 * zoomScale)} />

            <BasicTextLabel Size={UDim2.fromOffset(0, 20)} AutomaticSize="X" Text={Label} />
            <Div Size={new UDim2(1, 0, 0, 20 * zoomScale)} BackgroundColor={ColorPicker.GetColor()} onMouseButton1Down={OnMouseButton1Down}>
                <uicorner CornerRadius={StyleProperties.CornerRadius} />
                <uiflexitem FlexMode="Fill" />
            </Div>
        </Div>
    );
}
