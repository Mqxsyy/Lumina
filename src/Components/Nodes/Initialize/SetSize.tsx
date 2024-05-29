import React from "@rbxts/react";
import { SetSize as SetSizeAPI, SetSizeFieldNames } from "API/Nodes/Initialize/SetSize";
import ConnectableNumberField from "Components/NodeFields/ConnectableNumberField";
import { AddNode, type NodeData } from "Services/NodesService";
import Node from "../Node";

export function CreateSetSize() {
    return AddNode(new SetSizeAPI(), (data: NodeData) => {
        return (
            <SetSize
                key={data.node.updateOrder === -1 ? `node_${data.node.id}` : `node_${data.node.updateOrder}_${data.node.id}`}
                data={data}
            />
        );
    });
}

function SetSize({ data }: { data: NodeData }) {
    return (
        <Node
            Name="Set Size"
            NodeId={data.node.id}
            NodeAnchorPoint={data.anchorPoint}
            IsConnectedToSystem={data.node.connectedSystemId !== undefined}
        >
            <ConnectableNumberField
                NodeId={data.node.id}
                NodeField={(data.node as SetSizeAPI).nodeFields.size}
                NodeFieldName={SetSizeFieldNames.size}
                Label="Size"
            />
        </Node>
    );
}
