import React, { useEffect, useState } from "@rbxts/react";
import { NumberField as NumberFieldAPI } from "API/Fields/NumberField";
import { BasicTextLabel } from "Components/Basic/BasicTextLabel";
import { NumberInput } from "Components/Basic/NumberInput";
import Div from "Components/Div";
import { GetNodeById } from "Services/NodesService";
import { GetZoomScale } from "ZoomScale";

interface Props {
    NodeId: number;
    NodeField: NumberFieldAPI;

    Label: string;
    AllowNegative?: boolean;

    OverrideSetNumber?: (number: number) => void;
}

export default function NumberField({ NodeId, NodeField, Label, AllowNegative = false, OverrideSetNumber = undefined }: Props) {
    const [_, setForceRender] = useState(0);

    const zoomScale = GetZoomScale();

    useEffect(() => {
        const connection = NodeField.FieldChanged.Connect(() => {
            setForceRender((prev) => ++prev);
        });

        const connection2 = GetNodeById(NodeId)!.data.dataChanged.Connect(() => {
            setForceRender((prev) => ++prev);
        });

        return () => {
            connection.Disconnect();
            connection2.Disconnect();
        };
    }, []);

    return (
        <Div Size={UDim2.fromScale(1, 0)} AutomaticSize="Y">
            <uilistlayout FillDirection={"Horizontal"} VerticalAlignment={"Center"} Padding={new UDim(0, 10 * zoomScale)} />

            <BasicTextLabel Size={UDim2.fromOffset(0, 20)} AutomaticSize="X" Text={Label} TextYAlignment="Bottom" />
            <NumberInput
                AnchorPoint={new Vector2(1, 0)}
                Position={UDim2.fromScale(1, 0)}
                Size={new UDim2(1, 0, 0, 20)}
                Text={() => tostring(NodeField.GetNumber())}
                AllowNegative={AllowNegative}
                NumberChanged={OverrideSetNumber || NodeField.SetNumber}
            >
                <uiflexitem FlexMode={"Fill"} />
            </NumberInput>
        </Div>
    );
}
