import React, { useEffect, useState } from "@rbxts/react";
import { BooleanField as BooleanFieldAPI } from "API/Fields/BooleanField";
import { BasicTextLabel } from "Components/Basic/BasicTextLabel";
import CheckBox from "Components/Basic/CheckBox";
import { GetZoomScale } from "ZoomScale";

interface Props {
    NodeField: BooleanFieldAPI;
    Label: string;
}

export default function BooleanField({ NodeField, Label }: Props) {
    const [_, setForceRender] = useState(0);

    const zoomScale = GetZoomScale();

    useEffect(() => {
        const connection = NodeField.FieldChanged.Connect(() => {
            setForceRender((prev) => ++prev);
        });

        return () => {
            connection.Disconnect();
        };
    }, []);

    return (
        <imagebutton Size={UDim2.fromScale(1, 0)} Transparency={1} AutoButtonColor={false} AutomaticSize="Y">
            <uilistlayout FillDirection={"Horizontal"} VerticalAlignment={"Center"} Padding={new UDim(0, 10 * zoomScale)} />

            <BasicTextLabel Size={UDim2.fromOffset(0, 20)} AutomaticSize="X" Text={Label} TextYAlignment="Bottom" />
            <CheckBox
                Size={UDim2.fromOffset(20, 20)}
                IsChecked={NodeField.GetBoolean()}
                OnChecked={(newValue) => NodeField.SetBoolean(newValue)}
            />
        </imagebutton>
    );
}
