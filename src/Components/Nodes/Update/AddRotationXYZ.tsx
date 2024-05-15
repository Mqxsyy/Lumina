import React from "@rbxts/react";
import { AddRotationXYZ as AddRotationXYZAPI, AddRotationXYZFieldNames } from "API/Nodes/Update/AddRotationXYZ";
import { Vector3Field } from "Components/NodeFields/Vector3Field";
import { AddNode, NodeData } from "Services/NodesService";
import Node from "../Node";

export function CreateAddRotationXYZ() {
    return AddNode(new AddRotationXYZAPI(), (data: NodeData) => {
        return <AddRotationXYZ key={`node_${data.node.id}`} data={data} />;
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
            <Vector3Field
                NodeId={data.node.id}
                NodeField={(data.node as AddRotationXYZAPI).nodeFields.rotation}
                NodeFieldName={AddRotationXYZFieldNames.rotation}
            />
        </Node>
    );
}
