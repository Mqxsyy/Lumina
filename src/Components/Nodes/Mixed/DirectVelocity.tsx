import React from "@rbxts/react";
import { DirectVelocity as DirectVelocityAPI } from "API/Nodes/Mixed/DirectVelocity";
import ConnectableVector3Field from "Components/NodeFields/ConnectableVector3Field";
import { AddNode, type NodeData } from "Services/NodesService";
import Node from "../Node";

export function CreateDirectVelocity() {
    return AddNode(new DirectVelocityAPI(), (data: NodeData) => {
        return (
            <DirectVelocity
                key={data.node.updateOrder === -1 ? `node_${data.node.id}` : `node_${data.node.updateOrder}_${data.node.id}`}
                data={data}
            />
        );
    });
}

function DirectVelocity({ data }: { data: NodeData }) {
    return (
        <Node
            Name="Direct Velocity"
            NodeId={data.node.id}
            NodeAnchorPoint={data.anchorPoint}
            IsConnectedToSystem={data.node.connectedSystemId !== undefined}
        >
            <ConnectableVector3Field
                NodeId={data.node.id}
                NodeField={(data.node as DirectVelocityAPI).nodeFields.direction}
                NodeFieldName={"direction"}
                Label="Direction"
            />
            <ConnectableVector3Field
                NodeId={data.node.id}
                NodeField={(data.node as DirectVelocityAPI).nodeFields.upVector}
                NodeFieldName={"upVector"}
                Label="Up Vector"
            />
        </Node>
    );
}
