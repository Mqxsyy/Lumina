import React from "@rbxts/react";
import { TrigonometryType, ValueType } from "API/Nodes/FieldStates";
import { Trigonometry as TrigonometryAPI } from "API/Nodes/Logic/Trigonometry";
import ConnectableNumberField from "Components/NodeFields/ConnectableNumberField";
import StateField from "Components/NodeFields/StateField";
import { AddNode, type NodeData } from "Services/NodesService";
import Node from "../Node";

export function CreateTrigonometry(trigonometryType = TrigonometryType.Sin) {
    return AddNode(new TrigonometryAPI(trigonometryType), (data: NodeData) => {
        return (
            <Trigonometry
                key={data.node.updateOrder === -1 ? `node_${data.node.id}` : `node_${data.node.updateOrder}_${data.node.id}`}
                data={data}
            />
        );
    });
}

function Trigonometry({ data }: { data: NodeData }) {
    return (
        <Node
            Name="Trigonometry"
            NodeId={data.node.id}
            NodeAnchorPoint={data.anchorPoint}
            IsConnectedToSystem={data.node.connectedSystemId !== undefined}
            Width={175}
            Types={[
                {
                    field: (data.node as TrigonometryAPI).nodeFields.trigonometryType,
                    order: 1,
                },
            ]}
            Outputs={[
                {
                    order: 1,
                    valueType: ValueType.Number,
                    valueName: "Number",
                    fn: (particleData) => (data.node as TrigonometryAPI).Calculate(particleData) as number,
                },
            ]}
        >
            <ConnectableNumberField
                NodeId={data.node.id}
                NodeField={(data.node as TrigonometryAPI).nodeFields.input}
                NodeFieldName={"input"}
                AllowNegative={true}
            />
        </Node>
    );
}
