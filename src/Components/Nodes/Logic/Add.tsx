import React from "@rbxts/react";
import { Add as AddAPI, AddFieldNames } from "API/Nodes/Logic/Add";
import type { LogicNode } from "API/Nodes/Logic/LogicNode";
import ConnectableNumberField from "Components/NodeFields/ConnectableNumberField";
import { AddNode, type NodeData } from "Services/NodesService";
import Node from "../Node";

export function CreateAdd() {
    return AddNode(new AddAPI(), (data: NodeData) => {
        return <Add key={data.order === -1 ? `node_${data.node.id}` : `node_${data.order}_${data.node.id}`} data={data} />;
    });
}

function Add({ data }: { data: NodeData }) {
    return (
        <Node
            Name="Add"
            NodeId={data.node.id}
            NodeAnchorPoint={data.anchorPoint}
            IsConnectedToSystem={data.node.connectedSystemId !== undefined}
            ConnectioNode={data.node as LogicNode}
        >
            <ConnectableNumberField
                NodeId={data.node.id}
                NodeField={(data.node as AddAPI).nodeFields.a}
                NodeFieldName={AddFieldNames.a}
                Label="A"
                AllowNegative={true}
            />
            <ConnectableNumberField
                NodeId={data.node.id}
                NodeField={(data.node as AddAPI).nodeFields.b}
                NodeFieldName={AddFieldNames.b}
                Label="B"
                AllowNegative={true}
            />
        </Node>
    );
}
