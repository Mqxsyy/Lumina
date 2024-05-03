import React from "@rbxts/react";
import { Vector3Field as Vector3FieldAPI } from "API/Fields/Vector3Field";
import { BasicTextLabel } from "Components/Basic/BasicTextLabel";
import { NumberInput } from "Components/Basic/NumberInput";
import ConnectionPointIn from "Components/Connections/ConnectionPointIn";
import Div from "Components/Div";
import { GetZoomScale } from "ZoomScale";

interface Props {
    NodeId: number;
    NodeField: Vector3FieldAPI;
    NodeFieldName: string;

    Label?: string;
    ValueLabels?: [string, string, string];

    AllowConnections?: [boolean, boolean, boolean];
}

export function Vector3Field({
    NodeId,
    NodeField,
    NodeFieldName,
    Label = undefined,
    ValueLabels = ["X", "Y", "Z"],
    AllowConnections = [true, true, true],
}: Props) {
    const zoomScale = GetZoomScale();

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
                        AllowNegative={true}
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
                        AllowNegative={true}
                        NumberChanged={NodeField.SetY}
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

                    {AllowConnections[2] && (
                        <ConnectionPointIn
                            NodeId={NodeId}
                            NodeFieldName={NodeFieldName}
                            BindFunction={NodeField.BindZ}
                            UnbindFunction={NodeField.UnbindZ}
                        />
                    )}
                    <BasicTextLabel
                        Size={UDim2.fromOffset(0, 20)}
                        AutomaticSize="X"
                        Text={ValueLabels[2]}
                        TextYAlignment="Bottom"
                    />
                    <NumberInput
                        AnchorPoint={new Vector2(1, 0)}
                        Position={UDim2.fromScale(1, 0)}
                        Size={new UDim2(1, 0, 0, 20)}
                        Text={() => tostring(NodeField.GetZ())}
                        AllowNegative={true}
                        NumberChanged={NodeField.SetZ}
                    >
                        <uiflexitem FlexMode={"Fill"} />
                    </NumberInput>
                </Div>
            </Div>
        </Div>
    );
}
