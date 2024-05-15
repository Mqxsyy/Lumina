import React from "@rbxts/react";
import { VolumetricParticle as VolumetricParticleAPI } from "API/Nodes/Render/VolumetricParticle";
import ShapeField from "Components/NodeFields/ShapeField";
import { AddNode, NodeData } from "Services/NodesService";
import Node from "../Node";

export function CreateVolumetricParticle() {
    return AddNode(new VolumetricParticleAPI(), (data: NodeData) => {
        return <VolumetricParticle key={`node_${data.node.id}`} data={data} />;
    });
}

function VolumetricParticle({ data }: { data: NodeData }) {
    return (
        <Node
            Name="Plane Particle"
            NodeId={data.node.id}
            NodeAnchorPoint={data.anchorPoint}
            IsConnectedToSystem={data.node.connectedSystemId !== undefined}
        >
            <ShapeField NodeField={(data.node as VolumetricParticleAPI).nodeFields.shape} Label={"Shape"} />
        </Node>
    );
}
