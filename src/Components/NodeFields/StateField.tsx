import React, { useEffect, useRef, useState } from "@rbxts/react";
import type { StateField as StateFieldAPI } from "API/Fields/StateField";
import { BasicTextLabel } from "Components/Basic/BasicTextLabel";
import HighlightableTextButton from "Components/Basic/HighlightableTextButton";
import Div from "Components/Div";
import { EnableDropdown } from "Services/DropdownService";
import { StyleColors, StyleProperties } from "Style";
import { GetZoomScale } from "ZoomScale";

interface Props {
    NodeField: StateFieldAPI;
    Label: string;
}

export default function StateField({ NodeField, Label }: Props) {
    const [_, setForceRender] = useState(0);

    const zoomScale = GetZoomScale();
    const elementRef = useRef<ImageButton>();

    useEffect(() => {
        const connection = NodeField.FieldChanged.Connect(() => {
            setForceRender((prev) => prev + 1);
        });

        return () => {
            connection.Disconnect();
        };
    }, []);

    const enableDropdown = () => {
        if (elementRef.current === undefined) return;

        const pos = elementRef.current.AbsolutePosition;
        const posUDim2 = UDim2.fromOffset(pos.X, pos.Y + elementRef.current.AbsoluteSize.Y + 5);

        const buttons = [];
        const states = NodeField.GetStateCollection();

        for (const [k, v] of pairs(states)) {
            buttons.push(
                <HighlightableTextButton
                    key={k}
                    Size={UDim2.fromScale(1, 0)}
                    Text={v}
                    OnClick={() => {
                        NodeField.SetState(v);
                    }}
                />,
            );
        }

        EnableDropdown(posUDim2, elementRef.current.AbsoluteSize.X, buttons);
    };

    return (
        <Div Size={UDim2.fromScale(1, 0)} AutomaticSize="Y">
            <uilistlayout FillDirection={"Horizontal"} VerticalAlignment={"Center"} Padding={new UDim(0, 10 * zoomScale)} />

            <BasicTextLabel Size={UDim2.fromOffset(0, 20)} AutomaticSize="X" Text={Label} TextYAlignment="Bottom" />
            <imagebutton
                Size={new UDim2(1, 0, 0, 20 * zoomScale)}
                BackgroundColor3={StyleColors.Highlight}
                AutoButtonColor={false}
                Event={{ MouseButton1Down: enableDropdown }}
                ref={elementRef}
            >
                <uipadding PaddingRight={new UDim(0, 4 * zoomScale)} PaddingTop={new UDim(0, 4 * zoomScale)} />
                <uiflexitem FlexMode="Fill" />
                <uicorner CornerRadius={StyleProperties.CornerRadius} />

                <BasicTextLabel
                    Text={NodeField.GetState()}
                    TextColor={StyleColors.TextDark}
                    TextXAlignment="Center"
                    TextYAlignment="Center"
                />
            </imagebutton>
        </Div>
    );
}
