import React from "@rbxts/react";
import type { LogicNode } from "API/Nodes/Logic/LogicNode";
import { NumberOut as NumberOutAPI } from "API/Nodes/Logic/NumberOut";
import NumberField from "Components/NodeFields/NumberField";
import { AddNode, type NodeData } from "Services/NodesService";
import Node from "../Node";

export function CreateNumberOut() {
    return AddNode(new NumberOutAPI(), (data: NodeData) => {
        return (
            <NumberOut
                key={data.node.updateOrder === -1 ? `node_${data.node.id}` : `node_${data.node.updateOrder}_${data.node.id}`}
                data={data}
            />
        );
    });
}

function NumberOut({ data }: { data: NodeData }) {
    return (
        <Node
            Name="Number Out"
            NodeId={data.node.id}
            NodeAnchorPoint={data.anchorPoint}
            IsConnectedToSystem={data.node.connectedSystemId !== undefined}
            ConnectioNode={data.node as LogicNode}
        >
            <NumberField
                NodeId={data.node.id}
                NodeField={(data.node as NumberOutAPI).nodeFields.input}
                Label="Input"
                AllowNegative={true}
            />
        </Node>
    );
}
