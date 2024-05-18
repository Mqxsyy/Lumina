import React from "@rbxts/react";
import { LogicNode } from "API/Nodes/Logic/LogicNode";
import { Divide as DivideAPI, DivideFieldNames } from "API/Nodes/Logic/Divide";
import ConnectableNumberField from "Components/NodeFields/ConnectableNumberField";
import { AddNode, NodeData } from "Services/NodesService";
import Node from "../Node";

export function CreateDivide() {
    return AddNode(new DivideAPI(), (data: NodeData) => {
        return <Divide key={`node_${data.node.id}`} data={data} />;
    });
}

function Divide({ data }: { data: NodeData }) {
    return (
        <Node
            Name="Divide"
            NodeId={data.node.id}
            NodeAnchorPoint={data.anchorPoint}
            IsConnectedToSystem={data.node.connectedSystemId !== undefined}
            ConnectioNode={data.node as LogicNode}
        >
            <ConnectableNumberField
                NodeId={data.node.id}
                NodeField={(data.node as DivideAPI).nodeFields.a}
                NodeFieldName={DivideFieldNames.a}
                Label="A"
                AllowNegative={true}
            />
            <ConnectableNumberField
                NodeId={data.node.id}
                NodeField={(data.node as DivideAPI).nodeFields.b}
                NodeFieldName={DivideFieldNames.b}
                Label="B"
                AllowNegative={true}
            />
        </Node>
    );
}
