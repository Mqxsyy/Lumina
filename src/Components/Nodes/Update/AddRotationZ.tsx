import React from "@rbxts/react";
import { CapitalizeFirstLetter } from "API/Lib";
import { AddRotationZ as AddRotationZAPI, AddRotationZFieldNames } from "API/Nodes/Update/AddRotationZ";
import ConnectableNumberField from "Components/NodeFields/ConnectableNumberField";
import { AddNode, NodeData } from "Services/NodesService";
import Node from "../Node";

export function CreateAddRotationZ() {
    return AddNode(new AddRotationZAPI(), (data: NodeData) => {
        return <AddRotationZ key={`node_${data.node.id}`} data={data} />;
    });
}

function AddRotationZ({ data }: { data: NodeData }) {
    return (
        <Node
            Name="Add Rotation Z"
            NodeId={data.node.id}
            NodeAnchorPoint={data.anchorPoint}
            IsConnectedToSystem={data.node.connectedSystemId !== undefined}
        >
            <ConnectableNumberField
                NodeId={data.node.id}
                NodeField={(data.node as AddRotationZAPI).nodeFields.rotation}
                NodeFieldName={AddRotationZFieldNames.rotation}
                Label={CapitalizeFirstLetter(AddRotationZFieldNames.rotation)}
                AllowNegative={true}
            />
        </Node>
    );
}
