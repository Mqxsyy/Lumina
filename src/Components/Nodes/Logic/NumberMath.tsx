import React from "@rbxts/react";
import { ValueType } from "API/Nodes/FieldStates";
import { NumberMath as NumberMathAPI } from "API/Nodes/Logic/NumberMath";
import type { ParticleData } from "API/ParticleService";
import ConnectableNumberField from "Components/NodeFields/ConnectableNumberField";
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
            Width={175}
            Types={[{ order: 1, field: (data.node as NumberMathAPI).nodeFields.operationType }]}
            Outputs={[
                {
                    order: 1,
                    valueType: ValueType.Number,
                    valueName: "Number",
                    fn: (particleData: ParticleData) => (data.node as NumberMathAPI).Calculate(particleData),
                },
            ]}
        >
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
