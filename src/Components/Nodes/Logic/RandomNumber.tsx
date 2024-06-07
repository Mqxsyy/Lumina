import React from "@rbxts/react";
import { ValueType } from "API/Nodes/FieldStates";
import { RandomNumber as RandomNumberAPI } from "API/Nodes/Logic/RandomNumber";
import { ConnectableVector2Field } from "Components/NodeFields/ConnectableVector2Field";
import { AddNode, type NodeData } from "Services/NodesService";
import Node from "../Node";

export function CreateRandomNumber() {
    return AddNode(new RandomNumberAPI(), (data: NodeData) => {
        return (
            <RandomNumber
                key={data.node.updateOrder === -1 ? `node_${data.node.id}` : `node_${data.node.updateOrder}_${data.node.id}`}
                data={data}
            />
        );
    });
}

function RandomNumber({ data }: { data: NodeData }) {
    return (
        <Node
            Name="Random Number"
            NodeId={data.node.id}
            NodeAnchorPoint={data.anchorPoint}
            IsConnectedToSystem={data.node.connectedSystemId !== undefined}
            ConnectionValueType={ValueType.Number}
        >
            <ConnectableVector2Field
                NodeId={data.node.id}
                NodeField={(data.node as RandomNumberAPI).nodeFields.range}
                NodeFieldName={"range"}
                ValueLabels={["Min", "Max"]}
                Label="Range"
            />
        </Node>
    );
}
