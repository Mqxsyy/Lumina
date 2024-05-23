import React, { useEffect, useState } from "@rbxts/react";
import type { ConnectableNumberField as NumberFieldAPI } from "API/Fields/ConnectableNumberField";
import { BasicTextLabel } from "Components/Basic/BasicTextLabel";
import { NumberInput } from "Components/Basic/NumberInput";
import ConnectionPointIn from "Components/Connections/ConnectionPointIn";
import Div from "Components/Div";
import { GetNodeById, type NodeCollectionEntry } from "Services/NodesService";
import { GetZoomScale } from "ZoomScale";

interface Props {
    NodeId: number;
    NodeField: NumberFieldAPI;
    NodeFieldName: string;

    Label: string;
    AllowNegative?: boolean;

    OverrideSetNumber?: (number: number) => undefined;
}

export default function ConnectableNumberField({
    NodeId,
    NodeField,
    NodeFieldName,
    Label,
    AllowNegative = false,
    OverrideSetNumber = undefined,
}: Props) {
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
            <uilistlayout FillDirection={"Horizontal"} VerticalAlignment={"Center"} Padding={new UDim(0, 10 * zoomScale)} />

            <ConnectionPointIn
                NodeId={NodeId}
                NodeFieldName={NodeFieldName}
                BindNode={NodeField.ConnectNode}
                UnbindNode={NodeField.DisconnectNode}
            />
            <BasicTextLabel Size={UDim2.fromOffset(0, 20)} AutomaticSize="X" Text={Label} TextYAlignment="Bottom" />
            <NumberInput
                AnchorPoint={new Vector2(1, 0)}
                Position={UDim2.fromScale(1, 0)}
                Size={new UDim2(1, 0, 0, 20)}
                Text={() => NodeField.GetNumberAsText()}
                AllowNegative={AllowNegative}
                Disabled={NodeField.connectedNode !== undefined}
                NumberChanged={OverrideSetNumber || (NodeField.SetNumber as () => undefined)}
            >
                <uiflexitem FlexMode={"Fill"} />
            </NumberInput>
        </Div>
    );
}
