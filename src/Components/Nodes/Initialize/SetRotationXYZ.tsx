import React from "@rbxts/react";
import { SetRotationXYZ as SetRotationXYZAPI, SetRotationXYZFieldNames } from "API/Nodes/Initialize/SetRotationXYZ";
import { ConnectableVector3Field } from "Components/NodeFields/ConnectableVector3Field";
import { AddNode, type NodeData } from "Services/NodesService";
import Node from "../Node";

export function CreateSetRotationXYZ() {
    return AddNode(new SetRotationXYZAPI(), (data: NodeData) => {
        return (
            <SetRotationXYZ
                key={data.node.updateOrder === -1 ? `node_${data.node.id}` : `node_${data.node.updateOrder}_${data.node.id}`}
                data={data}
            />
        );
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
