import React from "@rbxts/react";
import { MoveTowards as MoveTowardsAPI } from "API/Nodes/Update/MoveTowards";
import ConnectableNumberField from "Components/NodeFields/ConnectableNumberField";
import ConnectableVector3Field from "Components/NodeFields/ConnectableVector3Field";
import { AddNode, type NodeData } from "Services/NodesService";
import Node from "../Node";

export function CreateMoveTowards() {
    return AddNode(new MoveTowardsAPI(), (data: NodeData) => {
        return (
            <MoveTowards
                key={data.node.updateOrder === -1 ? `node_${data.node.id}` : `node_${data.node.updateOrder}_${data.node.id}`}
                data={data}
            />
        );
    });
}

function MoveTowards({ data }: { data: NodeData }) {
    return (
        <Node
            Name="Move Towards"
            NodeId={data.node.id}
            NodeAnchorPoint={data.anchorPoint}
            IsConnectedToSystem={data.node.connectedSystemId !== undefined}
        >
            <ConnectableVector3Field
                NodeId={data.node.id}
                NodeField={(data.node as MoveTowardsAPI).nodeFields.target}
                NodeFieldName={"target"}
                Label={"Target Position"}
            />
            <ConnectableNumberField
                NodeId={data.node.id}
                NodeField={(data.node as MoveTowardsAPI).nodeFields.intensity}
                NodeFieldName={"intensity"}
                Label={"Intensity"}
            />
            <ConnectableNumberField
                NodeId={data.node.id}
                NodeField={(data.node as MoveTowardsAPI).nodeFields.speed}
                NodeFieldName={"speed"}
                Label={"Speed"}
            />
        </Node>
    );
}
