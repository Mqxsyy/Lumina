import React, { useEffect, useRef, useState } from "@rbxts/react";
import type { ConnectableVector3Field as Vector3FieldAPI } from "API/Fields/ConnectableVector3Field";
import { ValueType } from "API/Nodes/FieldStates";
import { BasicTextLabel } from "Components/Basic/BasicTextLabel";
import { NumberInput } from "Components/Basic/NumberInput";
import ConnectionPointIn from "Components/Connections/ConnectionPointIn";
import Div from "Components/Div";
import { GetNodeById, type NodeCollectionEntry } from "Services/NodesService";
import { StyleColors } from "API/Style";
import { GetZoomScale } from "ZoomScale";

interface Props {
    NodeId: number;
    NodeField: Vector3FieldAPI;
    NodeFieldName: string;

    Label: string;
    ValueLabels?: [string, string, string];
    AllowNegatives?: [boolean, boolean, boolean];
}

export default function ConnectableVector3Field({
    NodeId,
    NodeField,
    NodeFieldName,
    Label,
    ValueLabels = ["X", "Y", "Z"],
    AllowNegatives = [true, true, true],
}: Props) {
    const [_, setForceRender] = useState(0);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const zoomScale = GetZoomScale();

    const wasOpenRef = useRef(false);

    if (wasOpenRef.current && NodeField.connectedNodeVector3 === undefined) {
        setIsCollapsed(false);
        wasOpenRef.current = false;
    }

    if (!isCollapsed && NodeField.connectedNodeVector3 !== undefined) {
        wasOpenRef.current = !isCollapsed;
        setIsCollapsed(true);
    }

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
            <uilistlayout FillDirection="Vertical" Padding={new UDim(0, 5 * zoomScale)} />

            <Div Size={UDim2.fromScale(1, 0)} AutomaticSize="Y">
                <uilistlayout
                    FillDirection="Horizontal"
                    VerticalAlignment={"Center"}
                    Padding={new UDim(0, 10 * zoomScale)}
                    VerticalFlex={"Fill"}
                />

                <ConnectionPointIn
                    NodeId={NodeId}
                    NodeFieldName={NodeFieldName}
                    ValueName={"XYZ"}
                    ValueType={ValueType.Vector3}
                    BindNode={NodeField.ConnectVector3}
                    UnbindNode={NodeField.DisconnectVector3}
                />
                <BasicTextLabel Size={new UDim2(0, 0, 0, 20)} AutomaticSize="X" Text={Label} />

                {NodeField.connectedNodeVector3 === undefined && (
                    <imagebutton
                        Size={UDim2.fromOffset(16 * zoomScale, 16 * zoomScale)}
                        BackgroundTransparency={1}
                        Image={isCollapsed ? "rbxassetid://17708292950" : "rbxassetid://17708291709"}
                        ImageColor3={StyleColors.Highlight}
                        ScaleType={"Fit"}
                        Event={{
                            MouseButton1Down: () => {
                                setIsCollapsed(!isCollapsed);
                            },
                        }}
                    />
                )}
            </Div>

            {!isCollapsed && NodeField.connectedNodeVector3 === undefined && (
                <Div Size={UDim2.fromScale(1, 0)} AutomaticSize="Y">
                    <uipadding PaddingLeft={new UDim(0, 10 * zoomScale)} />
                    <uilistlayout FillDirection="Vertical" Padding={new UDim(0, 5 * zoomScale)} />

                    <Div Size={UDim2.fromScale(1, 0)} AutomaticSize="Y">
                        <uilistlayout FillDirection="Horizontal" VerticalAlignment={"Center"} Padding={new UDim(0, 10 * zoomScale)} />

                        <ConnectionPointIn
                            NodeId={NodeId}
                            NodeFieldName={NodeFieldName}
                            ValueName={"X"}
                            ValueType={ValueType.Number}
                            BindNode={NodeField.ConnectX}
                            UnbindNode={NodeField.DisconnectX}
                        />
                        <BasicTextLabel Size={UDim2.fromOffset(0, 20)} AutomaticSize="X" Text={ValueLabels[0]} TextYAlignment="Bottom" />
                        <NumberInput
                            AnchorPoint={new Vector2(1, 0)}
                            Position={UDim2.fromScale(1, 0)}
                            Size={new UDim2(1, 0, 0, 20)}
                            Text={() => NodeField.GetXAsText()}
                            AllowNegative={AllowNegatives[0]}
                            Disabled={NodeField.connectedNodeX !== undefined}
                            NumberChanged={NodeField.SetX as (value: number) => undefined}
                        >
                            <uiflexitem FlexMode={"Fill"} />
                        </NumberInput>
                    </Div>
                    <Div Size={UDim2.fromScale(1, 0)} AutomaticSize="Y">
                        <uilistlayout FillDirection="Horizontal" VerticalAlignment={"Center"} Padding={new UDim(0, 10 * zoomScale)} />

                        <ConnectionPointIn
                            NodeId={NodeId}
                            NodeFieldName={NodeFieldName}
                            ValueName={"Y"}
                            ValueType={ValueType.Number}
                            BindNode={NodeField.ConnectY}
                            UnbindNode={NodeField.DisconnectY}
                        />
                        <BasicTextLabel Size={UDim2.fromOffset(0, 20)} AutomaticSize="X" Text={ValueLabels[1]} TextYAlignment="Bottom" />
                        <NumberInput
                            AnchorPoint={new Vector2(1, 0)}
                            Position={UDim2.fromScale(1, 0)}
                            Size={new UDim2(1, 0, 0, 20)}
                            Text={() => NodeField.GetYAsText()}
                            AllowNegative={AllowNegatives[1]}
                            Disabled={NodeField.connectedNodeY !== undefined}
                            NumberChanged={NodeField.SetY as (value: number) => undefined}
                        >
                            <uiflexitem FlexMode={"Fill"} />
                        </NumberInput>
                    </Div>
                    <Div Size={UDim2.fromScale(1, 0)} AutomaticSize="Y">
                        <uilistlayout FillDirection="Horizontal" VerticalAlignment={"Center"} Padding={new UDim(0, 10 * zoomScale)} />

                        <ConnectionPointIn
                            NodeId={NodeId}
                            NodeFieldName={NodeFieldName}
                            ValueName={"Z"}
                            ValueType={ValueType.Number}
                            BindNode={NodeField.ConnectZ}
                            UnbindNode={NodeField.DisconnectZ}
                        />
                        <BasicTextLabel Size={UDim2.fromOffset(0, 20)} AutomaticSize="X" Text={ValueLabels[2]} TextYAlignment="Bottom" />
                        <NumberInput
                            AnchorPoint={new Vector2(1, 0)}
                            Position={UDim2.fromScale(1, 0)}
                            Size={new UDim2(1, 0, 0, 20)}
                            Text={() => NodeField.GetZAsText()}
                            AllowNegative={AllowNegatives[2]}
                            Disabled={NodeField.connectedNodeZ !== undefined}
                            NumberChanged={NodeField.SetZ as (value: number) => undefined}
                        >
                            <uiflexitem FlexMode={"Fill"} />
                        </NumberInput>
                    </Div>
                </Div>
            )}
        </Div>
    );
}
