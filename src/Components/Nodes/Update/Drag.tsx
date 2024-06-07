import React from "@rbxts/react";
import { Drag as DragAPI } from "API/Nodes/Update/Drag";
import ConnectableNumberField from "Components/NodeFields/ConnectableNumberField";
import { AddNode, type NodeData } from "Services/NodesService";
import Node from "../Node";

export function CreateDrag() {
    return AddNode(new DragAPI(), (data: NodeData) => {
        return (
            <Drag
                key={data.node.updateOrder === -1 ? `node_${data.node.id}` : `node_${data.node.updateOrder}_${data.node.id}`}
                data={data}
            />
        );
    });
}

function Drag({ data }: { data: NodeData }) {
    return (
        <Node
            Name="Drag"
            NodeId={data.node.id}
            NodeAnchorPoint={data.anchorPoint}
            IsConnectedToSystem={data.node.connectedSystemId !== undefined}
        >
            <ConnectableNumberField
                NodeId={data.node.id}
                NodeField={(data.node as DragAPI).nodeFields.drag}
                NodeFieldName={"drag"}
                Label={"Drag"}
            />
        </Node>
    );
}
