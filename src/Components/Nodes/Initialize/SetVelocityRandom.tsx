import React from "@rbxts/react";
import { SetVelocityRandom as SetVelocityRandomAPI, SetVelocityRandomFieldNames } from "API/Nodes/Initialize/SetVelocityRandom";
import { ConnectableVector2Field } from "Components/NodeFields/ConnectableVector2Field";
import { AddNode, type NodeData } from "Services/NodesService";
import Node from "../Node";

export function CreateSetVelocityRandom() {
    return AddNode(new SetVelocityRandomAPI(), (data: NodeData) => {
        return <SetVelocityRandom key={data.order === -1 ? `node_${data.node.id}` : `node_${data.order}_${data.node.id}`} data={data} />;
    });
}

function SetVelocityRandom({ data }: { data: NodeData }) {
    return (
        <Node
            Name="Set Velocity Random"
            NodeId={data.node.id}
            NodeAnchorPoint={data.anchorPoint}
            IsConnectedToSystem={data.node.connectedSystemId !== undefined}
        >
            <ConnectableVector2Field
                NodeId={data.node.id}
                NodeField={(data.node as SetVelocityRandomAPI).nodeFields.rangeX}
                NodeFieldName={SetVelocityRandomFieldNames.rangeX}
                Label={"Range X"}
                ValueLabels={["Min", "Max"]}
            />
            <ConnectableVector2Field
                NodeId={data.node.id}
                NodeField={(data.node as SetVelocityRandomAPI).nodeFields.rangeY}
                NodeFieldName={SetVelocityRandomFieldNames.rangeY}
                Label={"Range Y"}
                ValueLabels={["Min", "Max"]}
            />
            <ConnectableVector2Field
                NodeId={data.node.id}
                NodeField={(data.node as SetVelocityRandomAPI).nodeFields.rangeZ}
                NodeFieldName={SetVelocityRandomFieldNames.rangeZ}
                Label={"Range Z"}
                ValueLabels={["Min", "Max"]}
            />
        </Node>
    );
}
