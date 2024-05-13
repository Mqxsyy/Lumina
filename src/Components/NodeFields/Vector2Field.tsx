import React, { useEffect, useState } from "@rbxts/react";
import { Vector2Field as Vector2FieldAPI } from "API/Fields/Vector2Field";
import { BasicTextLabel } from "Components/Basic/BasicTextLabel";
import { NumberInput } from "Components/Basic/NumberInput";
import ConnectionPointIn from "Components/Connections/ConnectionPointIn";
import Div from "Components/Div";
import { GetNodeById } from "Services/NodesService";
import { GetZoomScale } from "ZoomScale";

interface Props {
    NodeId: number;
    NodeField: Vector2FieldAPI;
    NodeFieldName: string;

    Label?: string;
    ValueLabels?: [string, string];

    AllowNegatives?: [boolean, boolean];
    AllowConnections?: [boolean, boolean];
}

export function Vector2Field({
    NodeField,
    NodeId,
    NodeFieldName,
    Label = undefined,
    ValueLabels = ["X", "Y"],
    AllowNegatives = [true, true],
    AllowConnections = [true, true],
}: Props) {
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
            {Label !== undefined && <uilistlayout FillDirection="Vertical" Padding={new UDim(0, 5 * zoomScale)} />}
            {Label !== undefined && <BasicTextLabel Size={new UDim2(0.5, 0, 0, 20)} Text={Label} />}

            <Div Size={UDim2.fromScale(1, 0)} AutomaticSize="Y">
                <uilistlayout FillDirection="Vertical" Padding={new UDim(0, 5 * zoomScale)} />
                {Label !== undefined && <uipadding PaddingLeft={new UDim(0, 10 * zoomScale)} />}

                <Div Size={UDim2.fromScale(1, 0)} AutomaticSize="Y">
                    <uilistlayout
                        FillDirection="Horizontal"
                        VerticalAlignment={"Center"}
                        Padding={new UDim(0, 10 * zoomScale)}
                    />

                    {AllowConnections[0] && (
                        <ConnectionPointIn
                            NodeId={NodeId}
                            NodeFieldName={NodeFieldName}
                            ValueName={"X"}
                            BindFunction={NodeField.BindX}
                            UnbindFunction={NodeField.UnbindX}
                        />
                    )}
                    <BasicTextLabel
                        Size={UDim2.fromOffset(0, 20)}
                        AutomaticSize="X"
                        Text={ValueLabels[0]}
                        TextYAlignment="Bottom"
                    />
                    <NumberInput
                        AnchorPoint={new Vector2(1, 0)}
                        Position={UDim2.fromScale(1, 0)}
                        Size={new UDim2(1, 0, 0, 20)}
                        Text={() => tostring(NodeField.GetX())}
                        AllowNegative={AllowNegatives[0]}
                        Disabled={NodeField.boundNodeX !== undefined}
                        NumberChanged={NodeField.SetX}
                    >
                        <uiflexitem FlexMode={"Fill"} />
                    </NumberInput>
                </Div>
                <Div Size={UDim2.fromScale(1, 0)} AutomaticSize="Y">
                    <uilistlayout
                        FillDirection="Horizontal"
                        VerticalAlignment={"Center"}
                        Padding={new UDim(0, 10 * zoomScale)}
                    />

                    {AllowConnections[1] && (
                        <ConnectionPointIn
                            NodeId={NodeId}
                            NodeFieldName={NodeFieldName}
                            ValueName={"Y"}
                            BindFunction={NodeField.BindY}
                            UnbindFunction={NodeField.UnbindY}
                        />
                    )}
                    <BasicTextLabel
                        Size={UDim2.fromOffset(0, 20)}
                        AutomaticSize="X"
                        Text={ValueLabels[1]}
                        TextYAlignment="Bottom"
                    />
                    <NumberInput
                        AnchorPoint={new Vector2(1, 0)}
                        Position={UDim2.fromScale(1, 0)}
                        Size={new UDim2(1, 0, 0, 20)}
                        Text={() => tostring(NodeField.GetY())}
                        AllowNegative={AllowNegatives[1]}
                        Disabled={NodeField.boundNodeY !== undefined}
                        NumberChanged={NodeField.SetY}
                    >
                        <uiflexitem FlexMode={"Fill"} />
                    </NumberInput>
                </Div>
            </Div>
        </Div>
    );
}
