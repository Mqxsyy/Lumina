import React from "@rbxts/react";
import { SetColor as SetColorAPI } from "API/Nodes/Initialize/SetColor";
import { ColorPickerField } from "Components/NodeFields/ColorPickerField";
import { AddNode, type NodeData } from "Services/NodesService";
import Node from "../Node";

export function CreateSetColor() {
    return AddNode(new SetColorAPI(), (data: NodeData) => {
        return (
            <SetColor
                key={data.node.updateOrder === -1 ? `node_${data.node.id}` : `node_${data.node.updateOrder}_${data.node.id}`}
                data={data}
            />
        );
    });
}

function SetColor({ data }: { data: NodeData }) {
    return (
        <Node
            Name="Set Color"
            NodeId={data.node.id}
            NodeAnchorPoint={data.anchorPoint}
            IsConnectedToSystem={data.node.connectedSystemId !== undefined}
        >
            <ColorPickerField Label="Color" ColorPicker={(data.node as SetColorAPI).nodeFields.color} />
        </Node>
    );
}
