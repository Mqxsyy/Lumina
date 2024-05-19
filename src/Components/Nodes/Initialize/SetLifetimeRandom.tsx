import React from "@rbxts/react";
import { SetLifetimeRandom as SetLifetimeRandomAPI, SetLifetimeRandomFieldNames } from "API/Nodes/Initialize/SetLifetimeRandom";
import { ConnectableVector2Field } from "Components/NodeFields/ConnectableVector2Field";
import { AddNode, NodeData } from "Services/NodesService";
import Node from "../Node";

export function CreateSetLifetimeRandom() {
    return AddNode(new SetLifetimeRandomAPI(), (data: NodeData) => {
        return <SetLifetimeRandom key={data.order === -1 ? `node_${data.node.id}` : `node_${data.order}_${data.node.id}`} data={data} />;
    });
}

function SetLifetimeRandom({ data }: { data: NodeData }) {
    return (
        <Node
            Name="Set Lifetime Random"
            NodeId={data.node.id}
            NodeAnchorPoint={data.anchorPoint}
            IsConnectedToSystem={data.node.connectedSystemId !== undefined}
        >
            <ConnectableVector2Field
                NodeId={data.node.id}
                NodeField={(data.node as SetLifetimeRandomAPI).nodeFields.range}
                NodeFieldName={SetLifetimeRandomFieldNames.range}
                ValueLabels={["Min", "Max"]}
                AllowNegatives={[false, false]}
            />
        </Node>
    );
}
