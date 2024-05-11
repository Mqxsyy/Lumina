import React from "@rbxts/react";
import { AddPosition as AddPositionAPI, AddPositionFieldNames } from "API/Nodes/Initialize/AddPosition";
import { Vector3Field } from "Components/NodeFields/Vector3Field";
import { AddNode, NodeData } from "Services/NodesService";
import Node from "../Node";

export function CreateAddPosition() {
    return AddNode(new AddPositionAPI(), (data: NodeData) => {
        return <AddPosition key={`node_${data.node.id}`} data={data} />;
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
            <Vector3Field
                NodeId={data.node.id}
                NodeField={(data.node as AddPositionAPI).nodeFields.position}
                NodeFieldName={AddPositionFieldNames.position}
            />
        </Node>
    );
}
