import React from "@rbxts/react";
import { ConstantSpawn as ConstantSpawnAPI } from "API/Nodes/Spawn/ConstantSpawn";
import NumberField from "Components/NodeFields/NumberField";
import { AddNode, type NodeData } from "Services/NodesService";
import Node from "../Node";

export function CreateConstantSpawn() {
    return AddNode(new ConstantSpawnAPI(), (data: NodeData) => {
        return (
            <ConstantSpawn
                key={data.node.updateOrder === -1 ? `node_${data.node.id}` : `node_${data.node.updateOrder}_${data.node.id}`}
                data={data}
            />
        );
    });
}

function ConstantSpawn({ data }: { data: NodeData }) {
    const { node } = data;
    const { id, nodeFields } = node as ConstantSpawnAPI;

    const rateChanged = (number: number) => {
        if (number > 1000) {
            nodeFields.rate.SetNumber(1000);
        }

        nodeFields.rate.SetNumber(number);
    };

    return (
        <Node
            Name="Constant Spawn"
            NodeId={data.node.id}
            NodeAnchorPoint={data.anchorPoint}
            IsConnectedToSystem={data.node.connectedSystemId !== undefined}
        >
            <NumberField
                NodeId={id}
                NodeField={nodeFields.rate}
                Label={"Constant Spawn"}
                OverrideSetNumber={rateChanged as (number: number) => undefined}
            />
        </Node>
    );
}
