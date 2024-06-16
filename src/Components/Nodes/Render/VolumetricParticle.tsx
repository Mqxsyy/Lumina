import React from "@rbxts/react";
import { VolumetricParticle as VolumetricParticleAPI } from "API/Nodes/Render/VolumetricParticle";
import StateField from "Components/NodeFields/StateField";
import { AddNode, type NodeData } from "Services/NodesService";
import Node from "../Node";

export function CreateVolumetricParticle() {
    return AddNode(new VolumetricParticleAPI(), (data: NodeData) => {
        return (
            <VolumetricParticle
                key={data.node.updateOrder === -1 ? `node_${data.node.id}` : `node_${data.node.updateOrder}_${data.node.id}`}
                data={data}
            />
        );
    });
}

function VolumetricParticle({ data }: { data: NodeData }) {
    return (
        <Node
            Name="Volumetric Particle"
            NodeId={data.node.id}
            NodeAnchorPoint={data.anchorPoint}
            IsConnectedToSystem={data.node.connectedSystemId !== undefined}
            Types={[
                {
                    field: (data.node as VolumetricParticleAPI).nodeFields.shape,
                    order: 1,
                },
            ]}
        />
    );
}
