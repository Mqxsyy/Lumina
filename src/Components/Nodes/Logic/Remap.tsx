import React from "@rbxts/react";
import { ValueType } from "API/Nodes/FieldStates";
import { Remap as RemapAPI } from "API/Nodes/Logic/Remap";
import ConnectableNumberField from "Components/NodeFields/ConnectableNumberField";
import { ConnectableVector2Field } from "Components/NodeFields/ConnectableVector2Field";
import { AddNode, type NodeData } from "Services/NodesService";
import Node from "../Node";

export function CreateRemap() {
    return AddNode(new RemapAPI(), (data: NodeData) => {
        return (
            <Remap
                key={data.node.updateOrder === -1 ? `node_${data.node.id}` : `node_${data.node.updateOrder}_${data.node.id}`}
                data={data}
            />
        );
    });
}

function Remap({ data }: { data: NodeData }) {
    return (
        <Node
            Name="Remap"
            NodeId={data.node.id}
            NodeAnchorPoint={data.anchorPoint}
            IsConnectedToSystem={data.node.connectedSystemId !== undefined}
            ConnectionValueType={ValueType.Number}
        >
            <ConnectableNumberField
                NodeId={data.node.id}
                NodeField={(data.node as RemapAPI).nodeFields.input}
                NodeFieldName={"input"}
                Label="Input"
                AllowNegative={true}
            />
            <ConnectableVector2Field
                NodeId={data.node.id}
                NodeField={(data.node as RemapAPI).nodeFields.oldRange}
                NodeFieldName={"oldRange"}
                ValueLabels={["Min", "Max"]}
                AllowNegatives={[true, true]}
                Label="From Range"
            />
            <ConnectableVector2Field
                NodeId={data.node.id}
                NodeField={(data.node as RemapAPI).nodeFields.newRange}
                NodeFieldName={"newRange"}
                ValueLabels={["Min", "Max"]}
                AllowNegatives={[true, true]}
                Label="To Range"
            />
        </Node>
    );
}
