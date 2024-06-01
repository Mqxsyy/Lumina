import React from "@rbxts/react";
import { BasicMathOperation as BasicMathOperationAPI, BasicMathOperationFieldNames } from "API/Nodes/Logic/BasicMathOperation";
import type { LogicNode } from "API/Nodes/Logic/LogicNode";
import ConnectableNumberField from "Components/NodeFields/ConnectableNumberField";
import StateField from "Components/NodeFields/StateField";
import { AddNode, type NodeData } from "Services/NodesService";
import Node from "../Node";

export function CreateBasicMathOperation() {
    return AddNode(new BasicMathOperationAPI(), (data: NodeData) => {
        return (
            <BasicMathOperation
                key={data.node.updateOrder === -1 ? `node_${data.node.id}` : `node_${data.node.updateOrder}_${data.node.id}`}
                data={data}
            />
        );
    });
}

function BasicMathOperation({ data }: { data: NodeData }) {
    return (
        <Node
            Name="Basic Math Operation"
            NodeId={data.node.id}
            NodeAnchorPoint={data.anchorPoint}
            IsConnectedToSystem={data.node.connectedSystemId !== undefined}
            ConnectioNode={data.node as LogicNode}
            Width={175}
            UsePadding={false}
        >
            <StateField NodeField={(data.node as BasicMathOperationAPI).nodeFields.operationType} />
            <ConnectableNumberField
                NodeId={data.node.id}
                NodeField={(data.node as BasicMathOperationAPI).nodeFields.a}
                NodeFieldName={BasicMathOperationFieldNames.a}
                AllowNegative={true}
            />
            <ConnectableNumberField
                NodeId={data.node.id}
                NodeField={(data.node as BasicMathOperationAPI).nodeFields.b}
                NodeFieldName={BasicMathOperationFieldNames.b}
                AllowNegative={true}
            />
        </Node>
    );
}
