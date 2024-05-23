import React from "@rbxts/react";
import { VolumetricParticle as VolumetricParticleAPI } from "API/Nodes/Render/VolumetricParticle";
import VolumetricParticleShapeField from "Components/NodeFields/VolumetricParticleShapeField";
import { AddNode, type NodeData } from "Services/NodesService";
import Node from "../Node";

export function CreateVolumetricParticle() {
    return AddNode(new VolumetricParticleAPI(), (data: NodeData) => {
        return <VolumetricParticle key={data.order === -1 ? `node_${data.node.id}` : `node_${data.order}_${data.node.id}`} data={data} />;
    });
}

function VolumetricParticle({ data }: { data: NodeData }) {
    return (
        <Node
            Name="Volumetric Particle"
            NodeId={data.node.id}
            NodeAnchorPoint={data.anchorPoint}
            IsConnectedToSystem={data.node.connectedSystemId !== undefined}
        >
            <VolumetricParticleShapeField NodeField={(data.node as VolumetricParticleAPI).nodeFields.shape} Label={"Shape"} />
        </Node>
    );
}
