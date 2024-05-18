import React from "@rbxts/react";
import { CapitalizeFirstLetter } from "API/Lib";
import { BurstSpawn as BurstSpawnAPI, BurstSpawnFieldNames } from "API/Nodes/Spawn/BurstSpawn";
import { AddNode, NodeData } from "Services/NodesService";
import Node from "../Node";
import NumberField from "Components/NodeFields/NumberField";

export function CreateBurstSpawn() {
    return AddNode(new BurstSpawnAPI(), (data: NodeData) => {
        return <BurstSpawn key={`node_${data.node.id}`} data={data} />;
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
            <NumberField
                NodeId={data.node.id}
                NodeField={(data.node as BurstSpawnAPI).nodeFields.amount}
                Label={CapitalizeFirstLetter(BurstSpawnFieldNames.amount)}
            />
        </Node>
    );
}
