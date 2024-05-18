import React from "@rbxts/react";
import { ConnectableVector3Field } from "Components/NodeFields/ConnectableVector3Field";
import { AddNode, NodeData } from "Services/NodesService";
import Node from "../Node";
import { SetRotationXYZ as SetRotationXYZAPI, SetRotationXYZFieldNames } from "API/Nodes/Initialize/SetRotationXYZ";

export function CreateSetRotationXYZ() {
    return AddNode(new SetRotationXYZAPI(), (data: NodeData) => {
        return <SetRotationXYZ key={`node_${data.node.id}`} data={data} />;
    });
}

function SetRotationXYZ({ data }: { data: NodeData }) {
    return (
        <Node
            Name="Set Rotation XYZ"
            NodeId={data.node.id}
            NodeAnchorPoint={data.anchorPoint}
            IsConnectedToSystem={data.node.connectedSystemId !== undefined}
        >
            <ConnectableVector3Field
                NodeId={data.node.id}
                NodeField={(data.node as SetRotationXYZAPI).nodeFields.rotation}
                NodeFieldName={SetRotationXYZFieldNames.rotation}
            />
        </Node>
    );
}
