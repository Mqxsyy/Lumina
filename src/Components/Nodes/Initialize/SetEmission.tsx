import React from "@rbxts/react";
import { CapitalizeFirstLetter } from "API/Lib";
import { SetEmission as SetEmissionAPI, SetEmissionFieldNames } from "API/Nodes/Initialize/SetEmission";
import ConnectableNumberField from "Components/NodeFields/ConnectableNumberField";
import { AddNode, NodeData } from "Services/NodesService";
import Node from "../Node";

export function CreateSetEmission() {
    return AddNode(new SetEmissionAPI(), (data: NodeData) => {
        return <SetEmission key={`node_${data.node.id}`} data={data} />;
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
                NodeFieldName={SetEmissionFieldNames.emission}
                Label={CapitalizeFirstLetter(SetEmissionFieldNames.emission)}
            />
        </Node>
    );
}
