import React from "@rbxts/react";
import { CapitalizeFirstLetter } from "API/Lib";
import { LogicNode } from "API/Nodes/Logic/LogicNode";
import { RandomNumber as RandomNumberAPI, RandomNumberFieldNames } from "API/Nodes/Logic/RandomNumber";
import { Vector2Field } from "Components/NodeFields/Vector2Field";
import { AddNode, NodeData } from "Services/NodesService";
import Node from "../Node";

export function CreateRandomNumber() {
    return AddNode(new RandomNumberAPI(), (data: NodeData) => {
        return <RandomNumber key={`node_${data.node.id}`} data={data} />;
    });
}

function RandomNumber({ data }: { data: NodeData }) {
    return (
        <Node
            Name="Random Number"
            NodeId={data.node.id}
            NodeAnchorPoint={data.anchorPoint}
            IsConnectedToSystem={data.node.connectedSystemId !== undefined}
            ConnectionFunction={(data.node as LogicNode<number>).Calculate}
            ConnectioNode={data.node as LogicNode}
        >
            <Vector2Field
                NodeId={data.node.id}
                NodeField={(data.node as RandomNumberAPI).nodeFields.range}
                NodeFieldName={RandomNumberFieldNames.range}
                ValueLabels={["Min", "Max"]}
                AllowConnections={[false, false]}
            />
        </Node>
    );
}
