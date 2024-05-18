import React from "@rbxts/react";
import { LogicNode } from "API/Nodes/Logic/LogicNode";
import { AliveTime as AliveTimeAPI } from "API/Nodes/Logic/Alivetime";
import { AddNode, NodeData } from "Services/NodesService";
import Node from "../Node";
import Div from "Components/Div";

// BUG: needs children to move when canvas moves

export function CreateAliveTime() {
    return AddNode(new AliveTimeAPI(), (data: NodeData) => {
        return <AliveTime key={`node_${data.node.id}`} data={data} />;
    });
}

function AliveTime({ data }: { data: NodeData }) {
    return (
        <Node
            Name="AliveTime"
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
