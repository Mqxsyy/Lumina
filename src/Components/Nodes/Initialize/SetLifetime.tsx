import React from "@rbxts/react";
import { CapitalizeFirstLetter } from "API/Lib";
import { SetLifetime as SetLifetimeAPI, SetLifetimeFieldNames } from "API/Nodes/Initialize/SetLifetime";
import ConnectableNumberField from "Components/NodeFields/ConnectableNumberField";
import { AddNode, NodeData } from "Services/NodesService";
import Node from "../Node";

export function CreateSetLifetime() {
    return AddNode(new SetLifetimeAPI(), (data: NodeData) => {
        return <SetLifetime key={data.order === -1 ? `node_${data.node.id}` : `node_${data.order}_${data.node.id}`} data={data} />;
    });
}

function SetLifetime({ data }: { data: NodeData }) {
    return (
        <Node
            Name="Set Lifetime"
            NodeId={data.node.id}
            NodeAnchorPoint={data.anchorPoint}
            IsConnectedToSystem={data.node.connectedSystemId !== undefined}
        >
            <ConnectableNumberField
                NodeId={data.node.id}
                NodeField={(data.node as SetLifetimeAPI).nodeFields.time}
                NodeFieldName={SetLifetimeFieldNames.time}
                Label={CapitalizeFirstLetter(SetLifetimeFieldNames.time)}
            />
        </Node>
    );
}
