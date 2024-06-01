import React from "@rbxts/react";
import { ValueType } from "API/Nodes/FieldStates";
import { Clamp as ClampAPI, ClampFieldNames } from "API/Nodes/Logic/Clamp";
import type { LogicNode } from "API/Nodes/Logic/LogicNode";
import ConnectableNumberField from "Components/NodeFields/ConnectableNumberField";
import { ConnectableVector2Field } from "Components/NodeFields/ConnectableVector2Field";
import { AddNode, type NodeData } from "Services/NodesService";
import Node from "../Node";

export function CreateClamp() {
    return AddNode(new ClampAPI(), (data: NodeData) => {
        return (
            <Clamp
                key={data.node.updateOrder === -1 ? `node_${data.node.id}` : `node_${data.node.updateOrder}_${data.node.id}`}
                data={data}
            />
        );
    });
}

function Clamp({ data }: { data: NodeData }) {
    return (
        <Node
            Name="Clamp"
            NodeId={data.node.id}
            NodeAnchorPoint={data.anchorPoint}
            IsConnectedToSystem={data.node.connectedSystemId !== undefined}
            ConnectionValueType={ValueType.Number}
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
