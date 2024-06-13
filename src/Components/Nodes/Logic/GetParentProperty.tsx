import React from "@rbxts/react";
import { ValueType } from "API/Nodes/FieldStates";
import { GetParentProperty as GetParentPropertyAPI } from "API/Nodes/Logic/GetParentProperty";
import { BasicTextLabel } from "Components/Basic/BasicTextLabel";
import StateField from "Components/NodeFields/StateField";
import { AddNode, type NodeData } from "Services/NodesService";
import { StyleColors, StyleProperties } from "Style";
import { GetZoomScale } from "ZoomScale";
import Node from "../Node";

export function CreateGetParentProperty() {
    return AddNode(new GetParentPropertyAPI(), (data: NodeData) => {
        return (
            <GetParentProperty
                key={data.node.updateOrder === -1 ? `node_${data.node.id}` : `node_${data.node.updateOrder}_${data.node.id}`}
                data={data}
            />
        );
    });
}

function GetParentProperty({ data }: { data: NodeData }) {
    const zoomScale = GetZoomScale();

    return (
        <Node
            Name="Get Parent Property"
            Width={175}
            NodeId={data.node.id}
            NodeAnchorPoint={data.anchorPoint}
            IsConnectedToSystem={data.node.connectedSystemId !== undefined}
            ConnectionValueType={ValueType.Vector3}
        >
            <imagebutton
                Size={new UDim2(1, 0, 0, 20 * zoomScale)}
                BackgroundColor3={StyleColors.Highlight}
                AutoButtonColor={false}
                Event={{
                    MouseButton1Down: () => {
                        (data.node as GetParentPropertyAPI).SetTemporaryParent();
                    },
                }}
            >
                <uipadding
                    PaddingLeft={new UDim(0, 4 * zoomScale)}
                    PaddingRight={new UDim(0, 4 * zoomScale)}
                    PaddingTop={new UDim(0, 2 * zoomScale)}
                />
                <uicorner CornerRadius={StyleProperties.CornerRadius} />

                <BasicTextLabel
                    Text={
                        (data.node as GetParentPropertyAPI).temporaryParent === undefined
                            ? "Set Target"
                            : `Target: ${((data.node as GetParentPropertyAPI).temporaryParent as BasePart).Name}`
                    }
                    TextColor={StyleColors.TextDark}
                    TextXAlignment="Center"
                    TextYAlignment="Center"
                    TextTruncate="AtEnd"
                />
            </imagebutton>
            <StateField NodeField={(data.node as GetParentPropertyAPI).nodeFields.propertyType} />
        </Node>
    );
}
