import React from "@rbxts/react";
import { SetPositionToParent as SetPositionToParentAPI } from "API/Nodes/Initialize/SetPositionToParent";
import { AddNode, type NodeData } from "Services/NodesService";
import Node from "../Node";

export function CreateSetPositionToParent() {
    return AddNode(new SetPositionToParentAPI(), (data: NodeData) => {
        return <SetPosition key={data.order === -1 ? `node_${data.node.id}` : `node_${data.order}_${data.node.id}`} data={data} />;
    });
}

function SetPosition({ data }: { data: NodeData }) {
    return (
        <Node
            Name="Set Position To Parent"
            NodeId={data.node.id}
            NodeAnchorPoint={data.anchorPoint}
            IsConnectedToSystem={data.node.connectedSystemId !== undefined}
        />
    );
}
