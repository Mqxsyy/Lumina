import React, { useEffect, useState } from "@rbxts/react";
import type { NumberField as NumberFieldAPI } from "API/Fields/NumberField";
import { BasicTextLabel } from "Components/Basic/BasicTextLabel";
import { NumberInput } from "Components/Basic/NumberInput";
import Div from "Components/Div";
import { GetNodeById, type NodeCollectionEntry } from "Services/NodesService";
import { GetZoomScale } from "ZoomScale";

interface Props {
    NodeId: number;
    NodeField: NumberFieldAPI;

    Label?: string;
    AllowNegative?: boolean;

    OverrideSetNumber?: (number: number) => undefined;
}

export default function NumberField({ NodeId, NodeField, Label = undefined, AllowNegative = false, OverrideSetNumber = undefined }: Props) {
    const [_, setForceRender] = useState(0);

    const zoomScale = GetZoomScale();

    useEffect(() => {
        const connection = NodeField.FieldChanged.Connect(() => {
            setForceRender((prev) => prev + 1);
        });

        const connection2 = (GetNodeById(NodeId) as NodeCollectionEntry).data.dataChanged.Connect(() => {
            setForceRender((prev) => prev + 1);
        });

        return () => {
            connection.Disconnect();
            connection2.Disconnect();
        };
    }, []);

    return (
        <Div Size={UDim2.fromScale(1, 0)} AutomaticSize="Y">
            {Label !== undefined && (
                <uilistlayout FillDirection={"Horizontal"} VerticalAlignment={"Center"} Padding={new UDim(0, 10 * zoomScale)} />
            )}
            {Label !== undefined && (
                <BasicTextLabel Size={UDim2.fromOffset(0, 20)} AutomaticSize="X" Text={Label} TextYAlignment="Bottom" />
            )}

            <NumberInput
                AnchorPoint={new Vector2(1, 0)}
                Position={UDim2.fromScale(1, 0)}
                Size={new UDim2(1, 0, 0, 20)}
                Text={() => tostring(NodeField.GetNumber())}
                AllowNegative={AllowNegative}
                NumberChanged={OverrideSetNumber || (NodeField.SetNumber as (value: number) => undefined)}
            >
                <uiflexitem FlexMode={"Fill"} />
            </NumberInput>
        </Div>
    );
}
