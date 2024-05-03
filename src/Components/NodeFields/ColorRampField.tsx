import React, { useEffect, useRef, useState } from "@rbxts/react";
import { ColorRampField as ColorRampFieldAPI } from "API/Fields/ColorRampField";
import { BasicTextLabel } from "Components/Basic/BasicTextLabel";
import Div from "Components/Div";
import { LoadColorRampAPI } from "Components/Windows/Ramps/ColorRamp";
import { StyleColors, StyleProperties } from "Style";
import { GetWindow, Windows } from "Windows/WindowSevice";
import { GetZoomScale } from "ZoomScale";

interface Props {
    Label: string;
    Ramp: ColorRampFieldAPI;
}

export function ColorRampField({ Label, Ramp }: Props) {
    const [forceRender, setForceRender] = useState(0);
    const windowRef = useRef<DockWidgetPluginGui>();

    const zoomScale = GetZoomScale();

    useEffect(() => {
        windowRef.current = GetWindow(Windows.ColorRamp)!;

        const fieldConnection = Ramp.FieldChanged.Connect(() => {
            setForceRender((prev) => (prev > 10 ? 0 : prev + 1));
        });

        const pointConnections: RBXScriptConnection[] = [];
        Ramp.GetAllPoints().forEach((point) => {
            const connection = point.color.FieldChanged.Connect(() => {
                setForceRender((prev) => (prev > 10 ? 0 : ++prev));
            });

            pointConnections.push(connection);
        });

        return () => {
            fieldConnection.Disconnect();
            pointConnections.forEach((connection) => connection.Disconnect());
        };
    }, [forceRender]);

    const OnMouseButton1Down = () => {
        LoadColorRampAPI(Ramp);
        windowRef.current!.Enabled = !windowRef.current!.Enabled;
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
                BackgroundColor={StyleColors.FullWhite}
                onMouseButton1Down={OnMouseButton1Down}
            >
                <uicorner CornerRadius={StyleProperties.CornerRadius} />
                <uigradient Color={Ramp.GetGradient()} />
                <uiflexitem FlexMode="Fill" />
            </Div>
        </Div>
    );
}
