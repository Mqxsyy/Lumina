import React from "@rbxts/react";
import { CapitalizeFirstLetter } from "API/Lib";
import { Accelerate as AccelerateAPI, AccelerateFieldNames } from "API/Nodes/Update/Accelerate";
import ConnectableNumberField from "Components/NodeFields/ConnectableNumberField";
import { AddNode, NodeData } from "Services/NodesService";
import Node from "../Node";

export function CreateAccelerate() {
    return AddNode(new AccelerateAPI(), (data: NodeData) => {
        return <Accelerate key={`node_${data.node.id}`} data={data} />;
    });
}

function Accelerate({ data }: { data: NodeData }) {
    return (
        <Node
            Name="Accelerate"
            NodeId={data.node.id}
            NodeAnchorPoint={data.anchorPoint}
            IsConnectedToSystem={data.node.connectedSystemId !== undefined}
        >
            <ConnectableNumberField
                NodeId={data.node.id}
                NodeField={(data.node as AccelerateAPI).nodeFields.acceleration}
                NodeFieldName={AccelerateFieldNames.acceleration}
                Label={CapitalizeFirstLetter(AccelerateFieldNames.acceleration)}
                AllowNegative={true}
            />
        </Node>
    );
}
