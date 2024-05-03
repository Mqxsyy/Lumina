import React from "@rbxts/react";
import {
    SetRotationZRandom as SetRotationZRandomAPI,
    SetRotationZRandomFieldNames,
} from "API/Nodes/Initialize/SetRotationZRandom";
import { Vector2Field } from "Components/NodeFields/Vector2Field";
import { AddNode, NodeData } from "Services/NodesService";
import Node from "../Node";

export function CreateSetRotationZRandom() {
    return AddNode(new SetRotationZRandomAPI(), (data: NodeData) => {
        return <SetRotationZRandom key={`node_${data.node.id}`} data={data} />;
    });
}

function SetRotationZRandom({ data }: { data: NodeData }) {
    return (
        <Node
            Name="Set Rotation Z Random"
            NodeId={data.node.id}
            NodeAnchorPoint={data.anchorPoint}
            IsConnectedToSystem={data.node.connectedSystemId !== undefined}
        >
            <Vector2Field
                NodeId={data.node.id}
                NodeField={(data.node as SetRotationZRandomAPI).nodeFields.range}
                NodeFieldName={SetRotationZRandomFieldNames.range}
                ValueLabels={["Min", "Max"]}
            />
        </Node>
    );
}
