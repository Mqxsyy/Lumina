import React from "@rbxts/react";
import { LogicNode } from "API/Nodes/Logic/LogicNode";
import { Multiply as MultiplyAPI, MultiplyFieldNames } from "API/Nodes/Logic/Multiply";
import ConnectableNumberField from "Components/NodeFields/ConnectableNumberField";
import { AddNode, NodeData } from "Services/NodesService";
import Node from "../Node";

export function CreateMultiply() {
    return AddNode(new MultiplyAPI(), (data: NodeData) => {
        return <Multiply key={data.order === -1 ? `node_${data.node.id}` : `node_${data.order}_${data.node.id}`} data={data} />;
    });
}

function Multiply({ data }: { data: NodeData }) {
    return (
        <Node
            Name="Multiply"
            NodeId={data.node.id}
            NodeAnchorPoint={data.anchorPoint}
            IsConnectedToSystem={data.node.connectedSystemId !== undefined}
            ConnectioNode={data.node as LogicNode}
        >
            <ConnectableNumberField
                NodeId={data.node.id}
                NodeField={(data.node as MultiplyAPI).nodeFields.a}
                NodeFieldName={MultiplyFieldNames.a}
                Label="A"
                AllowNegative={true}
            />
            <ConnectableNumberField
                NodeId={data.node.id}
                NodeField={(data.node as MultiplyAPI).nodeFields.b}
                NodeFieldName={MultiplyFieldNames.b}
                Label="B"
                AllowNegative={true}
            />
        </Node>
    );
}
