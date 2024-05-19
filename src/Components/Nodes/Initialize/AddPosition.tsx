import React from "@rbxts/react";
import { AddPosition as AddPositionAPI, AddPositionFieldNames } from "API/Nodes/Initialize/AddPosition";
import { ConnectableVector3Field } from "Components/NodeFields/ConnectableVector3Field";
import { AddNode, NodeData } from "Services/NodesService";
import Node from "../Node";

export function CreateAddPosition() {
    return AddNode(new AddPositionAPI(), (data: NodeData) => {
        return <AddPosition key={data.order === -1 ? `node_${data.node.id}` : `node_${data.order}_${data.node.id}`} data={data} />;
    });
}

function AddPosition({ data }: { data: NodeData }) {
    return (
        <Node
            Name="Add Position"
            NodeId={data.node.id}
            NodeAnchorPoint={data.anchorPoint}
            IsConnectedToSystem={data.node.connectedSystemId !== undefined}
        >
            <ConnectableVector3Field
                NodeId={data.node.id}
                NodeField={(data.node as AddPositionAPI).nodeFields.position}
                NodeFieldName={AddPositionFieldNames.position}
            />
        </Node>
    );
}
