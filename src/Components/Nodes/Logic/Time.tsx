import React from "@rbxts/react";
import type { LogicNode } from "API/Nodes/Logic/LogicNode";
import { Time as TimeAPI } from "API/Nodes/Logic/Time";
import Div from "Components/Div";
import { AddNode, type NodeData } from "Services/NodesService";
import Node from "../Node";

export function CreateTime() {
    return AddNode(new TimeAPI(), (data: NodeData) => {
        return <Time key={data.order === -1 ? `node_${data.node.id}` : `node_${data.order}_${data.node.id}`} data={data} />;
    });
}

function Time({ data }: { data: NodeData }) {
    return (
        <Node
            Name="Time"
            Width={100}
            NodeId={data.node.id}
            NodeAnchorPoint={data.anchorPoint}
            IsConnectedToSystem={data.node.connectedSystemId !== undefined}
            ConnectioNode={data.node as LogicNode}
        >
            <Div Size={UDim2.fromOffset(0, 0)} />
        </Node>
    );
}
