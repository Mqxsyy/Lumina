import React from "@rbxts/react";
import { ValueType } from "API/Nodes/FieldStates";
import { AliveTime as AliveTimeAPI } from "API/Nodes/Logic/Alivetime";
import type { ParticleData } from "API/ParticleService";
import Div from "Components/Div";
import { AddNode, type NodeData } from "Services/NodesService";
import Node from "../Node";

export function CreateAliveTime() {
    return AddNode(new AliveTimeAPI(), (data: NodeData) => {
        return (
            <AliveTime
                key={data.node.updateOrder === -1 ? `node_${data.node.id}` : `node_${data.node.updateOrder}_${data.node.id}`}
                data={data}
            />
        );
    });
}

function AliveTime({ data }: { data: NodeData }) {
    return (
        <Node
            Name="AliveTime"
            Width={100}
            NodeId={data.node.id}
            NodeAnchorPoint={data.anchorPoint}
            IsConnectedToSystem={data.node.connectedSystemId !== undefined}
            Outputs={[
                {
                    order: 1,
                    valueType: ValueType.Number,
                    valueName: "Number",
                    fn: (particleData: ParticleData) => (data.node as AliveTimeAPI).Calculate(particleData),
                },
            ]}
        />
    );
}
