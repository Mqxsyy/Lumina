import React from "@rbxts/react";
import { CapitalizeFirstLetter } from "API/Lib";
import { LookTowards as LookTowardsAPI, LookTowardsFieldNames } from "API/Nodes/Update/LookTowards";
import ConnectableNumberField from "Components/NodeFields/ConnectableNumberField";
import { ConnectableVector3Field } from "Components/NodeFields/ConnectableVector3Field";
import StateField from "Components/NodeFields/StateField";
import { AddNode, type NodeData } from "Services/NodesService";
import Node from "../Node";

export function CreateLookTowards() {
    return AddNode(new LookTowardsAPI(), (data: NodeData) => {
        return (
            <LookTowards
                key={data.node.updateOrder === -1 ? `node_${data.node.id}` : `node_${data.node.updateOrder}_${data.node.id}`}
                data={data}
            />
        );
    });
}

function LookTowards({ data }: { data: NodeData }) {
    return (
        <Node
            Name="Look Towards"
            NodeId={data.node.id}
            NodeAnchorPoint={data.anchorPoint}
            IsConnectedToSystem={data.node.connectedSystemId !== undefined}
        >
            <StateField NodeField={(data.node as LookTowardsAPI).nodeFields.axisType} />
            <ConnectableVector3Field
                NodeId={data.node.id}
                NodeField={(data.node as LookTowardsAPI).nodeFields.target}
                NodeFieldName={LookTowardsFieldNames.intensity}
                Label={"Target Position"}
            />
            <ConnectableNumberField
                NodeId={data.node.id}
                NodeField={(data.node as LookTowardsAPI).nodeFields.intensity}
                NodeFieldName={LookTowardsFieldNames.intensity}
                Label={CapitalizeFirstLetter(LookTowardsFieldNames.intensity)}
            />
        </Node>
    );
}
