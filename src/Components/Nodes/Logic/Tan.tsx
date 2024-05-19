import React from "@rbxts/react";
import { LogicNode } from "API/Nodes/Logic/LogicNode";
import { Tan as TanAPI, TanFieldNames } from "API/Nodes/Logic/Tan";
import ConnectableNumberField from "Components/NodeFields/ConnectableNumberField";
import { AddNode, NodeData } from "Services/NodesService";
import Node from "../Node";

export function CreateTan() {
    return AddNode(new TanAPI(), (data: NodeData) => {
        return <Tan key={data.order === -1 ? `node_${data.node.id}` : `node_${data.order}_${data.node.id}`} data={data} />;
    });
}

function Tan({ data }: { data: NodeData }) {
    return (
        <Node
            Name="Tan"
            NodeId={data.node.id}
            NodeAnchorPoint={data.anchorPoint}
            IsConnectedToSystem={data.node.connectedSystemId !== undefined}
            ConnectioNode={data.node as LogicNode}
        >
            <ConnectableNumberField
                NodeId={data.node.id}
                NodeField={(data.node as TanAPI).nodeFields.input}
                NodeFieldName={TanFieldNames.input}
                Label="Input"
                AllowNegative={true}
            />
        </Node>
    );
}
