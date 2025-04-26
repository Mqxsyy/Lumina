import React, { useEffect, useRef, useState } from "@rbxts/react";
import type { ColorRampField as ColorRampFieldAPI } from "API/Fields/ColorRampField";
import { BasicTextLabel } from "Components/Basic/BasicTextLabel";
import Div from "Components/Div";
import { LoadColorRampAPI } from "Components/Windows/Ramps/ColorRamp";
import { GetWindow, Windows } from "Services/WindowSevice";
import { StyleColors, StyleProperties } from "API/Style";
import { GetZoomScale } from "ZoomScale";

interface Props {
    Label: string;
    Ramp: ColorRampFieldAPI;
}

export function ColorRampField({ Label, Ramp }: Props) {
    const [forceRender, setForceRender] = useState(0);
    const windowRef = useRef(GetWindow(Windows.ColorRamp));

    const zoomScale = GetZoomScale();

    useEffect(() => {
        const fieldConnection = Ramp.FieldChanged.Connect(() => {
            setForceRender((prev) => prev + 1);
        });

        const pointConnections: RBXScriptConnection[] = [];

        for (const point of Ramp.GetAllPoints()) {
            const connection = point.color.FieldChanged.Connect(() => {
                setForceRender((prev) => prev + 1);
            });

            pointConnections.push(connection);
        }

        return () => {
            fieldConnection.Disconnect();
            for (const connection of pointConnections) {
                connection.Disconnect();
            }
        };
    }, [forceRender]);

    const OnMouseButton1Down = () => {
        LoadColorRampAPI(Ramp);
        windowRef.current.Enabled = !windowRef.current.Enabled;
    };

    return (
        <Div Size={UDim2.fromScale(1, 0)} AutomaticSize="Y">
            <uilistlayout FillDirection="Horizontal" VerticalAlignment={"Center"} Padding={new UDim(0, 10 * zoomScale)} />

            <BasicTextLabel Size={UDim2.fromOffset(0, 20)} AutomaticSize="X" Text={Label} />
            <Div Size={new UDim2(1, 0, 0, 20 * zoomScale)} BackgroundColor={StyleColors.FullWhite} onMouseButton1Down={OnMouseButton1Down}>
                <uicorner CornerRadius={StyleProperties.CornerRadius} />
                <uigradient Color={Ramp.GetGradient()} />
                <uiflexitem FlexMode="Fill" />
            </Div>
        </Div>
    );
}
