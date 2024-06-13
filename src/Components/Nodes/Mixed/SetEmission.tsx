import React from "@rbxts/react";
import { SetEmission as SetEmissionAPI } from "API/Nodes/Mixed/SetEmission";
import ConnectableNumberField from "Components/NodeFields/ConnectableNumberField";
import { AddNode, type NodeData } from "Services/NodesService";
import Node from "../Node";

export function CreateSetEmission() {
    return AddNode(new SetEmissionAPI(), (data: NodeData) => {
        return (
            <SetEmission
                key={data.node.updateOrder === -1 ? `node_${data.node.id}` : `node_${data.node.updateOrder}_${data.node.id}`}
                data={data}
            />
        );
    });
}

function SetEmission({ data }: { data: NodeData }) {
    return (
        <Node
            Name="Set Emission"
            NodeId={data.node.id}
            NodeAnchorPoint={data.anchorPoint}
            IsConnectedToSystem={data.node.connectedSystemId !== undefined}
        >
            <ConnectableNumberField
                NodeId={data.node.id}
                NodeField={(data.node as SetEmissionAPI).nodeFields.emission}
                NodeFieldName={"emission"}
                Label={"Emission"}
            />
        </Node>
    );
}
