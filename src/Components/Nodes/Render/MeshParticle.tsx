import React from "@rbxts/react";
import { MeshParticle as MeshParticleAPI } from "API/Nodes/Render/MeshParticle";
import NumberArrayField from "Components/NodeFields/NumberArrayField";
import NumberField from "Components/NodeFields/NumberField";
import { AddNode, type NodeData } from "Services/NodesService";
import Node from "../Node";

export function CreateMeshParticle() {
    return AddNode(new MeshParticleAPI(), (data: NodeData) => {
        return (
            <MeshParticle
                key={data.node.updateOrder === -1 ? `node_${data.node.id}` : `node_${data.node.updateOrder}_${data.node.id}`}
                data={data}
            />
        );
    });
}

function MeshParticle({ data }: { data: NodeData }) {
    return (
        <Node
            Name="Mesh Particle"
            NodeId={data.node.id}
            NodeAnchorPoint={data.anchorPoint}
            IsConnectedToSystem={data.node.connectedSystemId !== undefined}
        >
            <NumberField
                NodeId={data.node.id}
                NodeField={(data.node as MeshParticleAPI).nodeFields.meshId}
                Label={"Mesh Id"}
                AllowNegative={false}
            />
            <NumberArrayField NodeId={data.node.id} NodeField={(data.node as MeshParticleAPI).nodeFields.textures} Label={"Textures"} />
        </Node>
    );
}
