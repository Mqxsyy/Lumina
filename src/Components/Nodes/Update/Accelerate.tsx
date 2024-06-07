import React from "@rbxts/react";
import { Accelerate as AccelerateAPI } from "API/Nodes/Update/Accelerate";
import ConnectableNumberField from "Components/NodeFields/ConnectableNumberField";
import { AddNode, type NodeData } from "Services/NodesService";
import Node from "../Node";

export function CreateAccelerate() {
    return AddNode(new AccelerateAPI(), (data: NodeData) => {
        return (
            <Accelerate
                key={data.node.updateOrder === -1 ? `node_${data.node.id}` : `node_${data.node.updateOrder}_${data.node.id}`}
                data={data}
            />
        );
    });
}

function Accelerate({ data }: { data: NodeData }) {
    return (
        <Node
            Name="Accelerate"
            NodeId={data.node.id}
            NodeAnchorPoint={data.anchorPoint}
            IsConnectedToSystem={data.node.connectedSystemId !== undefined}
        >
            <ConnectableNumberField
                NodeId={data.node.id}
                NodeField={(data.node as AccelerateAPI).nodeFields.acceleration}
                NodeFieldName={"acceleration"}
                Label={"Acceleration"}
                AllowNegative={true}
            />
        </Node>
    );
}
