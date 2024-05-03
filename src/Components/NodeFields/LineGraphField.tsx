import React, { useEffect, useRef } from "@rbxts/react";
import { LineGraphField as LineGraphFieldAPI } from "API/Fields/LineGraphField";
import { BasicTextLabel } from "Components/Basic/BasicTextLabel";
import Div from "Components/Div";
import { LoadGraph } from "Components/Windows/Line/LineGraph";
import { StyleColors } from "Style";
import { GetWindow, Windows } from "Windows/WindowSevice";
import { GetZoomScale } from "ZoomScale";

interface Props {
    Label: string;
    Graph: LineGraphFieldAPI;
    MaxValue?: number;
}

export function LineGraphField({ Label, Graph, MaxValue = 1 }: Props) {
    const windowRef = useRef<DockWidgetPluginGui>();

    const zoomScale = GetZoomScale();

    useEffect(() => {
        windowRef.current = GetWindow(Windows.ValueGraph)!;
    }, []);

    const OnMouseButton1Down = () => {
        LoadGraph(Graph, MaxValue);
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
                BackgroundColor={StyleColors.Primary}
                onMouseButton1Down={OnMouseButton1Down}
            >
                <uipadding PaddingRight={new UDim(0, 4 * zoomScale)} PaddingTop={new UDim(0, 4 * zoomScale)} />
                <uiflexitem FlexMode="Fill" />

                <Div>
                    <uistroke Thickness={4 * zoomScale} Color={StyleColors.Secondary} />
                </Div>
            </Div>
        </Div>
    );
}
