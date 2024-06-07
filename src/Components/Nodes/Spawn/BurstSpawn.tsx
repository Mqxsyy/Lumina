import React from "@rbxts/react";
import { BurstSpawn as BurstSpawnAPI } from "API/Nodes/Spawn/BurstSpawn";
import NumberField from "Components/NodeFields/NumberField";
import { AddNode, type NodeData } from "Services/NodesService";
import Node from "../Node";

export function CreateBurstSpawn() {
    return AddNode(new BurstSpawnAPI(), (data: NodeData) => {
        return (
            <BurstSpawn
                key={data.node.updateOrder === -1 ? `node_${data.node.id}` : `node_${data.node.updateOrder}_${data.node.id}`}
                data={data}
            />
        );
    });
}

function BurstSpawn({ data }: { data: NodeData }) {
    return (
        <Node
            Name="Burst Spawn"
            NodeId={data.node.id}
            NodeAnchorPoint={data.anchorPoint}
            IsConnectedToSystem={data.node.connectedSystemId !== undefined}
        >
            <NumberField NodeId={data.node.id} NodeField={(data.node as BurstSpawnAPI).nodeFields.amount} Label={"Amount"} />
        </Node>
    );
}
