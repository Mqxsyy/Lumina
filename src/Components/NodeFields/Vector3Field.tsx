import React, { useEffect, useState } from "@rbxts/react";
import type { Vector3Field as Vector3FieldAPI } from "API/Fields/Vector3Field";
import { BasicTextLabel } from "Components/Basic/BasicTextLabel";
import { NumberInput } from "Components/Basic/NumberInput";
import Div from "Components/Div";
import { GetNodeById, type NodeCollectionEntry } from "Services/NodesService";
import { GetZoomScale } from "ZoomScale";

interface Props {
    NodeId: number;
    NodeField: Vector3FieldAPI;

    Label?: string;
    ValueLabels?: [string, string, string];
}

export function Vector3Field({ NodeId, NodeField, Label = undefined, ValueLabels = ["X", "Y", "Z"] }: Props) {
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
            {Label !== undefined && <uilistlayout FillDirection="Vertical" Padding={new UDim(0, 5 * zoomScale)} />}
            {Label !== undefined && <BasicTextLabel Size={new UDim2(0.5, 0, 0, 20)} Text={Label} />}

            <Div Size={UDim2.fromScale(1, 0)} AutomaticSize="Y">
                <uilistlayout FillDirection="Vertical" Padding={new UDim(0, 5 * zoomScale)} />
                {Label !== undefined && <uipadding PaddingLeft={new UDim(0, 10 * zoomScale)} />}

                <Div Size={UDim2.fromScale(1, 0)} AutomaticSize="Y">
                    <uilistlayout FillDirection="Horizontal" VerticalAlignment={"Center"} Padding={new UDim(0, 10 * zoomScale)} />

                    <BasicTextLabel Size={UDim2.fromOffset(0, 20)} AutomaticSize="X" Text={ValueLabels[0]} TextYAlignment="Bottom" />
                    <NumberInput
                        AnchorPoint={new Vector2(1, 0)}
                        Position={UDim2.fromScale(1, 0)}
                        Size={new UDim2(1, 0, 0, 20)}
                        Text={() => tostring(NodeField.GetX())}
                        AllowNegative={true}
                        NumberChanged={NodeField.SetX as (value: number) => undefined}
                    >
                        <uiflexitem FlexMode={"Fill"} />
                    </NumberInput>
                </Div>
                <Div Size={UDim2.fromScale(1, 0)} AutomaticSize="Y">
                    <uilistlayout FillDirection="Horizontal" VerticalAlignment={"Center"} Padding={new UDim(0, 10 * zoomScale)} />

                    <BasicTextLabel Size={UDim2.fromOffset(0, 20)} AutomaticSize="X" Text={ValueLabels[1]} TextYAlignment="Bottom" />
                    <NumberInput
                        AnchorPoint={new Vector2(1, 0)}
                        Position={UDim2.fromScale(1, 0)}
                        Size={new UDim2(1, 0, 0, 20)}
                        Text={() => tostring(NodeField.GetY())}
                        AllowNegative={true}
                        NumberChanged={NodeField.SetY as (value: number) => undefined}
                    >
                        <uiflexitem FlexMode={"Fill"} />
                    </NumberInput>
                </Div>
                <Div Size={UDim2.fromScale(1, 0)} AutomaticSize="Y">
                    <uilistlayout FillDirection="Horizontal" VerticalAlignment={"Center"} Padding={new UDim(0, 10 * zoomScale)} />

                    <BasicTextLabel Size={UDim2.fromOffset(0, 20)} AutomaticSize="X" Text={ValueLabels[2]} TextYAlignment="Bottom" />
                    <NumberInput
                        AnchorPoint={new Vector2(1, 0)}
                        Position={UDim2.fromScale(1, 0)}
                        Size={new UDim2(1, 0, 0, 20)}
                        Text={() => tostring(NodeField.GetZ())}
                        AllowNegative={true}
                        NumberChanged={NodeField.SetZ as (value: number) => undefined}
                    >
                        <uiflexitem FlexMode={"Fill"} />
                    </NumberInput>
                </Div>
            </Div>
        </Div>
    );
}
