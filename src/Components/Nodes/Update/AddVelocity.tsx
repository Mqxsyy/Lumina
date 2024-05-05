import React from "@rbxts/react";
import { AddVelocity as AddVelocityAPI, AddVelocityFieldNames } from "API/Nodes/Update/AddVelocity";
import { Vector3Field } from "Components/NodeFields/Vector3Field";
import { AddNode, NodeData } from "Services/NodesService";
import Node from "../Node";

export function CreateAddVelocity() {
    return AddNode(new AddVelocityAPI(), (data: NodeData) => {
        return <AddVelocity key={`node_${data.node.id}`} data={data} />;
    });
}

function AddVelocity({ data }: { data: NodeData }) {
    return (
        <Node
            Name="Add Velocity"
            NodeId={data.node.id}
            NodeAnchorPoint={data.anchorPoint}
            IsConnectedToSystem={data.node.connectedSystemId !== undefined}
        >
            <Vector3Field
                NodeId={data.node.id}
                NodeField={(data.node as AddVelocityAPI).nodeFields.velocity}
                NodeFieldName={AddVelocityFieldNames.velocity}
            />
        </Node>
    );
}
