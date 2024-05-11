import React from "@rbxts/react";
import { Vector3Field } from "Components/NodeFields/Vector3Field";
import { AddNode, NodeData } from "Services/NodesService";
import Node from "../Node";
import { SetPositionToParent as SetPositionToParentAPI } from "API/Nodes/Initialize/SetPositionToParent";

export function CreateSetPositionToParent() {
    return AddNode(new SetPositionToParentAPI(), (data: NodeData) => {
        return <SetPosition key={`node_${data.node.id}`} data={data} />;
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
