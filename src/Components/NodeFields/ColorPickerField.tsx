import React, { useEffect, useRef, useState } from "@rbxts/react";
import { ColorField } from "API/Fields/ColorField";
import { BasicTextLabel } from "Components/Basic/BasicTextLabel";
import Div from "Components/Div";
import { LoadColorPickerAPI } from "Components/Windows/Pickers.tsx/ColorPicker";
import { StyleProperties } from "Style";
import { GetWindow, Windows } from "Windows/WindowSevice";
import { GetZoomScale } from "ZoomScale";

interface Props {
    Label: string;
    ColorPicker: ColorField;
}

export function ColorPickerField({ Label, ColorPicker }: Props) {
    const windowRef = useRef<DockWidgetPluginGui>();
    const [_, setForceRender] = useState(0);

    const zoomScale = GetZoomScale();

    useEffect(() => {
        windowRef.current = GetWindow(Windows.ColorPicker)!;

        const connection = ColorPicker.FieldChanged.Connect(() => {
            setForceRender((prev) => (prev > 10 ? 0 : prev + 1));
        });

        return () => connection.Disconnect();
    }, []);

    const OnMouseButton1Down = () => {
        windowRef.current!.Enabled = !windowRef.current!.Enabled;
        LoadColorPickerAPI(ColorPicker);
    };

    return (
        <Div Size={UDim2.fromScale(1, 0)} AutomaticSize="Y">
            <uilistlayout
                FillDirection="Horizontal"
                VerticalAlignment={"Center"}
                Padding={new UDim(0, 10 * zoomScale)}
            />

            <BasicTextLabel Size={UDim2.fromOffset(0, 20)} AutomaticSize="X" Text={Label} />
            <Div
                Size={new UDim2(1, 0, 0, 20 * zoomScale)}
                BackgroundColor={ColorPicker.GetColor()}
                onMouseButton1Down={OnMouseButton1Down}
            >
                <uicorner CornerRadius={StyleProperties.CornerRadius} />
                <uiflexitem FlexMode="Fill" />
            </Div>
        </Div>
    );
}
