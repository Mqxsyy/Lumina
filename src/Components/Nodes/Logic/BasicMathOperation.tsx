import React from "@rbxts/react";
import { ValueType } from "API/Nodes/FieldStates";
import { NumberMath as NumberMathAPI } from "API/Nodes/Logic/NumberMath";
import ConnectableNumberField from "Components/NodeFields/ConnectableNumberField";
import StateField from "Components/NodeFields/StateField";
import { AddNode, type NodeData } from "Services/NodesService";
import Node from "../Node";

export function CreateNumberMath(operationType = "Add") {
    return AddNode(new NumberMathAPI(operationType), (data: NodeData) => {
        return (
            <NumberMath
                key={data.node.updateOrder === -1 ? `node_${data.node.id}` : `node_${data.node.updateOrder}_${data.node.id}`}
                data={data}
            />
        );
    });
}

function NumberMath({ data }: { data: NodeData }) {
    return (
        <Node
            Name="Number Math"
            NodeId={data.node.id}
            NodeAnchorPoint={data.anchorPoint}
            IsConnectedToSystem={data.node.connectedSystemId !== undefined}
            ConnectionValueType={ValueType.Number}
            Width={175}
        >
            <StateField NodeField={(data.node as NumberMathAPI).nodeFields.operationType} />
            <ConnectableNumberField
                NodeId={data.node.id}
                NodeField={(data.node as NumberMathAPI).nodeFields.a}
                NodeFieldName={"a"}
                AllowNegative={true}
            />
            <ConnectableNumberField
                NodeId={data.node.id}
                NodeField={(data.node as NumberMathAPI).nodeFields.b}
                NodeFieldName={"b"}
                AllowNegative={true}
            />
        </Node>
    );
}
