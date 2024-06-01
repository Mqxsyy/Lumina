import React from "@rbxts/react";
import type { LogicNode } from "API/Nodes/Logic/LogicNode";
import { Trigonometry as TrigonometryAPI, TrigonometryFieldNames } from "API/Nodes/Logic/Trigonometry";
import ConnectableNumberField from "Components/NodeFields/ConnectableNumberField";
import StateField from "Components/NodeFields/StateField";
import { AddNode, type NodeData } from "Services/NodesService";
import Node from "../Node";

export function CreateTrigonometry() {
    return AddNode(new TrigonometryAPI(), (data: NodeData) => {
        return (
            <Trigonometry
                key={data.node.updateOrder === -1 ? `node_${data.node.id}` : `node_${data.node.updateOrder}_${data.node.id}`}
                data={data}
            />
        );
    });
}

function Trigonometry({ data }: { data: NodeData }) {
    return (
        <Node
            Name="Trigonometry"
            NodeId={data.node.id}
            NodeAnchorPoint={data.anchorPoint}
            IsConnectedToSystem={data.node.connectedSystemId !== undefined}
            ConnectioNode={data.node as LogicNode}
            Width={175}
            UsePadding={false}
        >
            <StateField NodeField={(data.node as TrigonometryAPI).nodeFields.trigonometryType} />
            <ConnectableNumberField
                NodeId={data.node.id}
                NodeField={(data.node as TrigonometryAPI).nodeFields.input}
                NodeFieldName={TrigonometryFieldNames.input}
                AllowNegative={true}
            />
        </Node>
    );
}
