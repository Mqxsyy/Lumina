import React from "@rbxts/react";
import { AddVelocity as AddVelocityAPI, AddVelocityFieldNames } from "API/Nodes/Update/AddVelocity";
import { ConnectableVector3Field } from "Components/NodeFields/ConnectableVector3Field";
import { AddNode, NodeData } from "Services/NodesService";
import Node from "../Node";

export function CreateAddVelocity() {
    return AddNode(new AddVelocityAPI(), (data: NodeData) => {
        return <AddVelocity key={data.order === -1 ? `node_${data.node.id}` : `node_${data.order}_${data.node.id}`} data={data} />;
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
            <ConnectableVector3Field
                NodeId={data.node.id}
                NodeField={(data.node as AddVelocityAPI).nodeFields.velocity}
                NodeFieldName={AddVelocityFieldNames.velocity}
            />
        </Node>
    );
}
