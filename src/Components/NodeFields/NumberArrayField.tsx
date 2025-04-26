import React, { useEffect, useState } from "@rbxts/react";
import type { NumberArrayField as NumberArrayFieldAPI } from "API/Fields/NumberArrayField";
import { BasicTextLabel } from "Components/Basic/BasicTextLabel";
import { NumberInput } from "Components/Basic/NumberInput";
import Div from "Components/Div";
import { GetNodeById, type NodeCollectionEntry } from "Services/NodesService";
import { StyleColors } from "API/Style";
import { GetZoomScale } from "ZoomScale";

interface Props {
    NodeId: number;
    NodeField: NumberArrayFieldAPI;

    Label: string;
    AllowNegative?: boolean;
}

export default function NumberField({ NodeId, NodeField, Label, AllowNegative = false }: Props) {
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
            <uilistlayout FillDirection={"Vertical"} Padding={new UDim(0, 5 * zoomScale)} />

            <BasicTextLabel Size={UDim2.fromOffset(0, 20)} AutomaticSize="X" Text={Label} TextYAlignment="Bottom" />

            <Div Size={UDim2.fromScale(1, 0)} AutomaticSize="Y">
                <uipadding PaddingLeft={new UDim(0, 10 * zoomScale)} />
                <uilistlayout FillDirection={"Vertical"} Padding={new UDim(0, 5 * zoomScale)} />

                <Div Size={UDim2.fromScale(1, 0)} AutomaticSize="Y">
                    <uilistlayout FillDirection={"Vertical"} Padding={new UDim(0, 5 * zoomScale)} />
                    {NodeField.GetNumbers().map((number, index) => (
                        <Div key={`${index}${number}`} Size={UDim2.fromScale(1, 0)} AutomaticSize="Y">
                            <uilistlayout FillDirection={"Horizontal"} VerticalAlignment={"Center"} Padding={new UDim(0, 10 * zoomScale)} />

                            <BasicTextLabel Size={UDim2.fromOffset(0, 20 * zoomScale)} AutomaticSize="X" Text={`${index + 1}`} />
                            <NumberInput
                                Size={new UDim2(1, 0, 0, 20)}
                                AllowNegative={AllowNegative}
                                Text={() => tostring(number)}
                                FocusLost={(newNumber) => {
                                    NodeField.AddNumberAtIndex(index, newNumber);
                                }}
                            >
                                <uiflexitem FlexMode={"Fill"} />
                            </NumberInput>
                            <imagebutton
                                Size={UDim2.fromOffset(20 * zoomScale, 20 * zoomScale)}
                                BackgroundTransparency={1}
                                Image={"rbxassetid://17818243422"}
                                ImageColor3={StyleColors.Highlight}
                                Event={{
                                    MouseButton1Down: () => {
                                        NodeField.RemoveNumber(index);
                                    },
                                }}
                            />
                        </Div>
                    ))}
                </Div>

                <imagebutton
                    Size={UDim2.fromOffset(20 * zoomScale, 20 * zoomScale)}
                    BackgroundTransparency={1}
                    Image={"rbxassetid://17818242210"}
                    ImageColor3={StyleColors.Highlight}
                    Event={{
                        MouseButton1Down: () => {
                            NodeField.AddNumber(0);
                        },
                    }}
                />
            </Div>
        </Div>
    );
}
