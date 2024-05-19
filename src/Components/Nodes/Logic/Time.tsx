import React from "@rbxts/react";
import { LogicNode } from "API/Nodes/Logic/LogicNode";
import { Time as TimeAPI } from "API/Nodes/Logic/Time";
import { AddNode, NodeData } from "Services/NodesService";
import Node from "../Node";
import Div from "Components/Div";

// BUG: needs children to move when canvas moves

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
