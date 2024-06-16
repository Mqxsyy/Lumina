import React from "@rbxts/react";
import { Position as PositionAPI } from "API/Nodes/Mixed/Position";
import ConnectableVector3Field from "Components/NodeFields/ConnectableVector3Field";
import StateField from "Components/NodeFields/StateField";
import { AddNode, type NodeData } from "Services/NodesService";
import Node from "../Node";

export function CreatePosition() {
    return AddNode(new PositionAPI(), (data: NodeData) => {
        return (
            <Position
                key={data.node.updateOrder === -1 ? `node_${data.node.id}` : `node_${data.node.updateOrder}_${data.node.id}`}
                data={data}
            />
        );
    });
}

function Position({ data }: { data: NodeData }) {
    return (
        <Node
            Name="Position"
            NodeId={data.node.id}
            NodeAnchorPoint={data.anchorPoint}
            IsConnectedToSystem={data.node.connectedSystemId !== undefined}
            Types={[
                {
                    field: (data.node as PositionAPI).nodeFields.nodeOperationType,
                    order: 1,
                },
            ]}
        >
            <ConnectableVector3Field
                NodeId={data.node.id}
                NodeField={(data.node as PositionAPI).nodeFields.position}
                NodeFieldName={"position"}
                Label={"Position"}
            />
        </Node>
    );
}
