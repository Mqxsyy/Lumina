import React from "@rbxts/react";
import type { LogicNode } from "API/Nodes/Logic/LogicNode";
import { Subtract as SubtractAPI, SubtractFieldNames } from "API/Nodes/Logic/Subtract";
import ConnectableNumberField from "Components/NodeFields/ConnectableNumberField";
import { AddNode, type NodeData } from "Services/NodesService";
import Node from "../Node";

export function CreateSubtract() {
    return AddNode(new SubtractAPI(), (data: NodeData) => {
        return (
            <Subtract
                key={data.node.updateOrder === -1 ? `node_${data.node.id}` : `node_${data.node.updateOrder}_${data.node.id}`}
                data={data}
            />
        );
    });
}

function Subtract({ data }: { data: NodeData }) {
    return (
        <Node
            Name="Subtract"
            NodeId={data.node.id}
            NodeAnchorPoint={data.anchorPoint}
            IsConnectedToSystem={data.node.connectedSystemId !== undefined}
            ConnectioNode={data.node as LogicNode}
        >
            <ConnectableNumberField
                NodeId={data.node.id}
                NodeField={(data.node as SubtractAPI).nodeFields.a}
                NodeFieldName={SubtractFieldNames.a}
                Label="A"
                AllowNegative={true}
            />
            <ConnectableNumberField
                NodeId={data.node.id}
                NodeField={(data.node as SubtractAPI).nodeFields.b}
                NodeFieldName={SubtractFieldNames.b}
                Label="B"
                AllowNegative={true}
            />
        </Node>
    );
}
