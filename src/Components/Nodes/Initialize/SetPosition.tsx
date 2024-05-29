import React from "@rbxts/react";
import { SetPosition as SetPositionAPI, SetPositionFieldNames } from "API/Nodes/Initialize/SetPosition";
import { ConnectableVector3Field } from "Components/NodeFields/ConnectableVector3Field";
import { AddNode, type NodeData } from "Services/NodesService";
import Node from "../Node";

export function CreateSetPosition() {
    return AddNode(new SetPositionAPI(), (data: NodeData) => {
        return (
            <SetPosition
                key={data.node.updateOrder === -1 ? `node_${data.node.id}` : `node_${data.node.updateOrder}_${data.node.id}`}
                data={data}
            />
        );
    });
}

function SetPosition({ data }: { data: NodeData }) {
    return (
        <Node
            Name="Set Position"
            NodeId={data.node.id}
            NodeAnchorPoint={data.anchorPoint}
            IsConnectedToSystem={data.node.connectedSystemId !== undefined}
        >
            <ConnectableVector3Field
                NodeId={data.node.id}
                NodeField={(data.node as SetPositionAPI).nodeFields.position}
                NodeFieldName={SetPositionFieldNames.position}
            />
        </Node>
    );
}
