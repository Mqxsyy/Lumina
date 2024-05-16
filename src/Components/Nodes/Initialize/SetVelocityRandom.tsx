import React from "@rbxts/react";
import { SetVelocityRandom as SetVelocityRandomAPI, SetVelocityRandomFieldNames } from "API/Nodes/Initialize/SetVelocityRandom";
import { Vector2Field } from "Components/NodeFields/Vector2Field";
import { AddNode, NodeData } from "Services/NodesService";
import Node from "../Node";

export function CreateSetVelocityRandom() {
    return AddNode(new SetVelocityRandomAPI(), (data: NodeData) => {
        return <SetVelocityRandom key={`node_${data.node.id}`} data={data} />;
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
            <Vector2Field
                NodeId={data.node.id}
                NodeField={(data.node as SetVelocityRandomAPI).nodeFields.rangeX}
                NodeFieldName={SetVelocityRandomFieldNames.rangeX}
                Label={"Range X"}
                ValueLabels={["Min", "Max"]}
            />
            <Vector2Field
                NodeId={data.node.id}
                NodeField={(data.node as SetVelocityRandomAPI).nodeFields.rangeY}
                NodeFieldName={SetVelocityRandomFieldNames.rangeY}
                Label={"Range Y"}
                ValueLabels={["Min", "Max"]}
            />
            <Vector2Field
                NodeId={data.node.id}
                NodeField={(data.node as SetVelocityRandomAPI).nodeFields.rangeZ}
                NodeFieldName={SetVelocityRandomFieldNames.rangeZ}
                Label={"Range Z"}
                ValueLabels={["Min", "Max"]}
            />
        </Node>
    );
}
