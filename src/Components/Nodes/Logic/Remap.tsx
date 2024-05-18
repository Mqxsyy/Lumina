import React from "@rbxts/react";
import { LogicNode } from "API/Nodes/Logic/LogicNode";
import { Remap as RemapAPI, RemapFieldNames } from "API/Nodes/Logic/Remap";
import ConnectableNumberField from "Components/NodeFields/ConnectableNumberField";
import { ConnectableVector2Field } from "Components/NodeFields/ConnectableVector2Field";
import { AddNode, NodeData } from "Services/NodesService";
import Node from "../Node";

export function CreateRemap() {
    return AddNode(new RemapAPI(), (data: NodeData) => {
        return <Remap key={`node_${data.node.id}`} data={data} />;
    });
}

function Remap({ data }: { data: NodeData }) {
    return (
        <Node
            Name="Remap"
            NodeId={data.node.id}
            NodeAnchorPoint={data.anchorPoint}
            IsConnectedToSystem={data.node.connectedSystemId !== undefined}
            ConnectioNode={data.node as LogicNode}
        >
            <ConnectableNumberField
                NodeId={data.node.id}
                NodeField={(data.node as RemapAPI).nodeFields.input}
                NodeFieldName={RemapFieldNames.input}
                Label="Input"
                AllowNegative={true}
            />
            <ConnectableVector2Field
                NodeId={data.node.id}
                NodeField={(data.node as RemapAPI).nodeFields.oldRange}
                NodeFieldName={RemapFieldNames.oldRange}
                ValueLabels={["Min", "Max"]}
                AllowNegatives={[true, true]}
                Label="From Range"
            />
            <ConnectableVector2Field
                NodeId={data.node.id}
                NodeField={(data.node as RemapAPI).nodeFields.newRange}
                NodeFieldName={RemapFieldNames.newRange}
                ValueLabels={["Min", "Max"]}
                AllowNegatives={[true, true]}
                Label="To Range"
            />
        </Node>
    );
}
