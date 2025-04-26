import React, { useEffect, useState } from "@rbxts/react";
import type { ConnectableColorField as ColorFieldAPI } from "API/Fields/ConnectableColorField";
import { ValueType } from "API/Nodes/FieldStates";
import { BasicTextLabel } from "Components/Basic/BasicTextLabel";
import ConnectionPointIn from "Components/Connections/ConnectionPointIn";
import Div from "Components/Div";
import { GetNodeById, type NodeCollectionEntry } from "Services/NodesService";
import { GetZoomScale } from "ZoomScale";
import { ColorPickerField } from "./ColorPickerField";

interface Props {
    NodeId: number;
    NodeFieldName: string;
    NodeField: ColorFieldAPI;
    Label: string;
}

export default function ConnectableColorField({ NodeId, NodeFieldName, NodeField, Label }: Props) {
    const [_, setForceRender] = useState(0);
    const zoomScale = GetZoomScale();

    useEffect(() => {
        const c1 = NodeField.FieldChanged.Connect(() => setForceRender((prev) => prev + 1));
        const c2 = (GetNodeById(NodeId) as NodeCollectionEntry).data.dataChanged.Connect(() => setForceRender((prev) => prev + 1));
        return () => {
            c1.Disconnect();
            c2.Disconnect();
        };
    }, []);

    return (
        <Div Size={UDim2.fromScale(1, 0)} AutomaticSize="Y">
            <uilistlayout FillDirection="Horizontal" VerticalAlignment="Center" Padding={new UDim(0, 10 * zoomScale)} />

            <ConnectionPointIn
                NodeId={NodeId}
                NodeFieldName={NodeFieldName}
                ValueType={ValueType.Color}
                ValueName="Color"
                BindNode={NodeField.ConnectColor}
                UnbindNode={NodeField.DisconnectColor}
            />
            <BasicTextLabel Size={new UDim2(0, 0, 0, 20)} AutomaticSize="X" Text={Label} />

            <ColorPickerField Disabled={NodeField.connectedNodeColor !== undefined} ColorPicker={NodeField.colorField} />
        </Div>
    );
}
