import React from "@rbxts/react";
import { MultiplyVelocityOverLife as MultiplyVelocityOverLifeAPI } from "API/Nodes/Update/MultiplyVelocityOverLife";
import { LineGraphField } from "Components/NodeFields/LineGraphField";
import { AddNode, type NodeData } from "Services/NodesService";
import Node from "../Node";

export function CreateMultiplyVelocityOverLife() {
    return AddNode(new MultiplyVelocityOverLifeAPI(), (data: NodeData) => {
        return (
            <MultiplyVelocityOverLife
                key={data.node.updateOrder === -1 ? `node_${data.node.id}` : `node_${data.node.updateOrder}_${data.node.id}`}
                data={data}
            />
        );
    });
}

function MultiplyVelocityOverLife({ data }: { data: NodeData }) {
    return (
        <Node
            Name="Multiply Velocity Over Life"
            NodeId={data.node.id}
            NodeAnchorPoint={data.anchorPoint}
            IsConnectedToSystem={data.node.connectedSystemId !== undefined}
        >
            <LineGraphField
                Label={"Graph"}
                Graph={(data.node as MultiplyVelocityOverLifeAPI).nodeFields.graph}
                MaxValue={10}
                MinValue={-10}
            />
        </Node>
    );
}
