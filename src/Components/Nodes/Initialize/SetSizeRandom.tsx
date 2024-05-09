import React from "@rbxts/react";
import { SetSizeRandom as SetSizeRandomAPI, SetSizeRandomFieldNames } from "API/Nodes/Initialize/SetSizeRandom";
import { Vector2Field } from "Components/NodeFields/Vector2Field";
import { AddNode, NodeData } from "Services/NodesService";
import Node from "../Node";

export function CreateSetSizeRandom() {
    return AddNode(new SetSizeRandomAPI(), (data: NodeData) => {
        return <SetSizeRandom key={`node_${data.node.id}`} data={data} />;
    });
}

function SetSizeRandom({ data }: { data: NodeData }) {
    return (
        <Node
            Name="Set Size Random"
            NodeId={data.node.id}
            NodeAnchorPoint={data.anchorPoint}
            IsConnectedToSystem={data.node.connectedSystemId !== undefined}
        >
            <Vector2Field
                NodeId={data.node.id}
                NodeField={(data.node as SetSizeRandomAPI).nodeFields.range}
                NodeFieldName={SetSizeRandomFieldNames.range}
                ValueLabels={["Min", "Max"]}
                AllowNegatives={[false, false]}
            />
        </Node>
    );
}
