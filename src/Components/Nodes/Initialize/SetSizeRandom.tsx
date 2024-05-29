import React from "@rbxts/react";
import { SetSizeRandom as SetSizeRandomAPI, SetSizeRandomFieldNames } from "API/Nodes/Initialize/SetSizeRandom";
import { ConnectableVector2Field } from "Components/NodeFields/ConnectableVector2Field";
import { AddNode, type NodeData } from "Services/NodesService";
import Node from "../Node";

export function CreateSetSizeRandom() {
    return AddNode(new SetSizeRandomAPI(), (data: NodeData) => {
        return (
            <SetSizeRandom
                key={data.node.updateOrder === -1 ? `node_${data.node.id}` : `node_${data.node.updateOrder}_${data.node.id}`}
                data={data}
            />
        );
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
            <ConnectableVector2Field
                NodeId={data.node.id}
                NodeField={(data.node as SetSizeRandomAPI).nodeFields.range}
                NodeFieldName={SetSizeRandomFieldNames.range}
                ValueLabels={["Min", "Max"]}
                AllowNegatives={[false, false]}
            />
        </Node>
    );
}
