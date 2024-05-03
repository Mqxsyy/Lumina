import React from "@rbxts/react";
import { CapitalizeFirstLetter } from "API/Lib";
import { SetTransparency as SetTransparencyAPI, SetTransparencyFieldNames } from "API/Nodes/Initialize/SetTransparency";
import NumberField from "Components/NodeFields/NumberField";
import { AddNode, NodeData } from "Services/NodesService";
import Node from "../Node";

export function CreateSetTransparency() {
    return AddNode(new SetTransparencyAPI(), (data: NodeData) => {
        return <SetTransparency key={`node_${data.node.id}`} data={data} />;
    });
}

function SetTransparency({ data }: { data: NodeData }) {
    return (
        <Node
            Name="Set Transparency"
            NodeId={data.node.id}
            NodeAnchorPoint={data.anchorPoint}
            IsConnectedToSystem={data.node.connectedSystemId !== undefined}
        >
            <NumberField
                NodeId={data.node.id}
                NodeField={(data.node as SetTransparencyAPI).nodeFields.transparency}
                NodeFieldName={SetTransparencyFieldNames.transparency}
                Label={CapitalizeFirstLetter(SetTransparencyFieldNames.transparency)}
            />
        </Node>
    );
}
