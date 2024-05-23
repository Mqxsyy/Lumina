import React from "@rbxts/react";
import { AddRotationXYZ as AddRotationXYZAPI, AddRotationXYZFieldNames } from "API/Nodes/Update/AddRotationXYZ";
import { ConnectableVector3Field } from "Components/NodeFields/ConnectableVector3Field";
import { AddNode, type NodeData } from "Services/NodesService";
import Node from "../Node";

export function CreateAddRotationXYZ() {
    return AddNode(new AddRotationXYZAPI(), (data: NodeData) => {
        return <AddRotationXYZ key={data.order === -1 ? `node_${data.node.id}` : `node_${data.order}_${data.node.id}`} data={data} />;
    });
}

function AddRotationXYZ({ data }: { data: NodeData }) {
    return (
        <Node
            Name="Add Rotation XYZ"
            NodeId={data.node.id}
            NodeAnchorPoint={data.anchorPoint}
            IsConnectedToSystem={data.node.connectedSystemId !== undefined}
        >
            <ConnectableVector3Field
                NodeId={data.node.id}
                NodeField={(data.node as AddRotationXYZAPI).nodeFields.rotation}
                NodeFieldName={AddRotationXYZFieldNames.rotation}
            />
        </Node>
    );
}
