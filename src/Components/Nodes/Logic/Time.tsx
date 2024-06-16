import React from "@rbxts/react";
import { ValueType } from "API/Nodes/FieldStates";
import { Time as TimeAPI } from "API/Nodes/Logic/Time";
import Div from "Components/Div";
import { AddNode, type NodeData } from "Services/NodesService";
import Node from "../Node";

export function CreateTime() {
    return AddNode(new TimeAPI(), (data: NodeData) => {
        return (
            <Time
                key={data.node.updateOrder === -1 ? `node_${data.node.id}` : `node_${data.node.updateOrder}_${data.node.id}`}
                data={data}
            />
        );
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
            Outputs={[
                {
                    order: 1,
                    valueType: ValueType.Number,
                    valueName: "Number",
                    fn: () => (data.node as TimeAPI).Calculate() as number,
                },
            ]}
        />
    );
}
