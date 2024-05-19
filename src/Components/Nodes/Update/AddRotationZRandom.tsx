import React from "@rbxts/react";
import { AddRotationZRandom as AddRotationZRandomAPI, AddRotationZRandomFieldNames } from "API/Nodes/Update/AddRotationZRandom";
import { ConnectableVector2Field } from "Components/NodeFields/ConnectableVector2Field";
import { AddNode, NodeData } from "Services/NodesService";
import Node from "../Node";

export function CreateAddRotationZRandom() {
    return AddNode(new AddRotationZRandomAPI(), (data: NodeData) => {
        return <AddRotationZRandom key={data.order === -1 ? `node_${data.node.id}` : `node_${data.order}_${data.node.id}`} data={data} />;
    });
}

function AddRotationZRandom({ data }: { data: NodeData }) {
    return (
        <Node
            Name="Add Rotation Z Random"
            NodeId={data.node.id}
            NodeAnchorPoint={data.anchorPoint}
            IsConnectedToSystem={data.node.connectedSystemId !== undefined}
        >
            <ConnectableVector2Field
                NodeId={data.node.id}
                NodeField={(data.node as AddRotationZRandomAPI).nodeFields.range}
                NodeFieldName={AddRotationZRandomFieldNames.range}
                ValueLabels={["Min", "Max"]}
            />
        </Node>
    );
}
