import React from "@rbxts/react";
import { LogicNode } from "API/Nodes/Logic/LogicNode";
import { Cos as CosAPI, CosFieldNames } from "API/Nodes/Logic/Cos";
import ConnectableNumberField from "Components/NodeFields/ConnectableNumberField";
import { AddNode, NodeData } from "Services/NodesService";
import Node from "../Node";

export function CreateCos() {
    return AddNode(new CosAPI(), (data: NodeData) => {
        return <Cos key={`node_${data.node.id}`} data={data} />;
    });
}

function Cos({ data }: { data: NodeData }) {
    return (
        <Node
            Name="Cos"
            NodeId={data.node.id}
            NodeAnchorPoint={data.anchorPoint}
            IsConnectedToSystem={data.node.connectedSystemId !== undefined}
            ConnectioNode={data.node as LogicNode}
        >
            <ConnectableNumberField
                NodeId={data.node.id}
                NodeField={(data.node as CosAPI).nodeFields.input}
                NodeFieldName={CosFieldNames.input}
                Label="Input"
                AllowNegative={true}
            />
        </Node>
    );
}
