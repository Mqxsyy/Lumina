import React from "@rbxts/react";
import { LogicNode } from "API/Nodes/Logic/LogicNode";
import { Clamp as ClampAPI, ClampFieldNames } from "API/Nodes/Logic/Clamp";
import ConnectableNumberField from "Components/NodeFields/ConnectableNumberField";
import { AddNode, NodeData } from "Services/NodesService";
import Node from "../Node";
import { ConnectableVector2Field } from "Components/NodeFields/ConnectableVector2Field";

export function CreateClamp() {
    return AddNode(new ClampAPI(), (data: NodeData) => {
        return <Clamp key={data.order === -1 ? `node_${data.node.id}` : `node_${data.order}_${data.node.id}`} data={data} />;
    });
}

function Clamp({ data }: { data: NodeData }) {
    return (
        <Node
            Name="Clamp"
            NodeId={data.node.id}
            NodeAnchorPoint={data.anchorPoint}
            IsConnectedToSystem={data.node.connectedSystemId !== undefined}
            ConnectioNode={data.node as LogicNode}
        >
            <ConnectableNumberField
                NodeId={data.node.id}
                NodeField={(data.node as ClampAPI).nodeFields.input}
                NodeFieldName={ClampFieldNames.input}
                Label="Input"
                AllowNegative={true}
            />
            <ConnectableVector2Field
                NodeId={data.node.id}
                NodeField={(data.node as ClampAPI).nodeFields.range}
                NodeFieldName={ClampFieldNames.range}
                ValueLabels={["Min", "Max"]}
                AllowNegatives={[true, true]}
            />
        </Node>
    );
}
