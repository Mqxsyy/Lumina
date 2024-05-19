import React from "@rbxts/react";
import type { LogicNode } from "API/Nodes/Logic/LogicNode";
import { NumberInput as NumberInputAPI, NumberInputFieldNames } from "API/Nodes/Logic/Number";
import ConnectableNumberField from "Components/NodeFields/ConnectableNumberField";
import { AddNode, type NodeData } from "Services/NodesService";
import Node from "../Node";

export function CreateNumberInput() {
    return AddNode(new NumberInputAPI(), (data: NodeData) => {
        return <NumberInput key={data.order === -1 ? `node_${data.node.id}` : `node_${data.order}_${data.node.id}`} data={data} />;
    });
}

function NumberInput({ data }: { data: NodeData }) {
    return (
        <Node
            Name="Number Input"
            NodeId={data.node.id}
            NodeAnchorPoint={data.anchorPoint}
            IsConnectedToSystem={data.node.connectedSystemId !== undefined}
            ConnectioNode={data.node as LogicNode}
        >
            <ConnectableNumberField
                NodeId={data.node.id}
                NodeField={(data.node as NumberInputAPI).nodeFields.input}
                NodeFieldName={NumberInputFieldNames.input}
                Label="Input"
                AllowNegative={true}
            />
        </Node>
    );
}
