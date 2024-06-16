import React from "@rbxts/react";
import { ValueType } from "API/Nodes/FieldStates";
import { Clamp as ClampAPI } from "API/Nodes/Logic/Clamp";
import type { ParticleData } from "API/ParticleService";
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
            Outputs={[
                {
                    order: 1,
                    valueType: ValueType.Number,
                    valueName: "Number",
                    fn: (particleData: ParticleData) => (data.node as ClampAPI).Calculate(particleData),
                },
            ]}
        >
            <ConnectableNumberField
                NodeId={data.node.id}
                NodeField={(data.node as ClampAPI).nodeFields.input}
                NodeFieldName={"input"}
                Label="Input"
                AllowNegative={true}
            />
            <ConnectableVector2Field
                NodeId={data.node.id}
                NodeField={(data.node as ClampAPI).nodeFields.range}
                NodeFieldName={"range"}
                ValueLabels={["Min", "Max"]}
                AllowNegatives={[true, true]}
                Label="Range"
            />
        </Node>
    );
}
