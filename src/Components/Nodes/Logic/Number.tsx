import React from "@rbxts/react";
import { LogicNode } from "API/Nodes/Logic/LogicNode";
import { Number as NumberAPI, NumberFieldNames } from "API/Nodes/Logic/Number";
import ConnectableNumberField from "Components/NodeFields/ConnectableNumberField";
import { AddNode, NodeData } from "Services/NodesService";
import Node from "../Node";

export function CreateNumber() {
    return AddNode(new NumberAPI(), (data: NodeData) => {
        return <Number key={`node_${data.node.id}`} data={data} />;
    });
}

function Number({ data }: { data: NodeData }) {
    return (
        <Node
            Name="Number"
            NodeId={data.node.id}
            NodeAnchorPoint={data.anchorPoint}
            IsConnectedToSystem={data.node.connectedSystemId !== undefined}
            ConnectioNode={data.node as LogicNode}
        >
            <ConnectableNumberField
                NodeId={data.node.id}
                NodeField={(data.node as NumberAPI).nodeFields.input}
                NodeFieldName={NumberFieldNames.input}
                Label="Input"
                AllowNegative={true}
            />
        </Node>
    );
}
