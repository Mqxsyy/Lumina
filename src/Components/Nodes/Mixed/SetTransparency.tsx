import React from "@rbxts/react";
import { SetTransparency as SetTransparencyAPI } from "API/Nodes/Mixed/SetTransparency";
import ConnectableNumberField from "Components/NodeFields/ConnectableNumberField";
import { AddNode, type NodeData } from "Services/NodesService";
import Node from "../Node";

export function CreateSetTransparency() {
    return AddNode(new SetTransparencyAPI(), (data: NodeData) => {
        return (
            <SetTransparency
                key={data.node.updateOrder === -1 ? `node_${data.node.id}` : `node_${data.node.updateOrder}_${data.node.id}`}
                data={data}
            />
        );
    });
}

function SetTransparency({ data }: { data: NodeData }) {
    return (
        <Node
            Name="Set Transparency"
            NodeId={data.node.id}
            NodeAnchorPoint={data.anchorPoint}
            IsConnectedToSystem={data.node.connectedSystemId !== undefined}
        >
            <ConnectableNumberField
                NodeId={data.node.id}
                NodeField={(data.node as SetTransparencyAPI).nodeFields.transparency}
                NodeFieldName={"transparency"}
                Label={"Transparency"}
            />
        </Node>
    );
}
