import React from "@rbxts/react";
import { SetColorOverLife as ColorOverLifeAPI } from "API/Nodes/Update/SetColorOverLife";
import { ColorRampField } from "Components/NodeFields/ColorRampField";
import { AddNode, NodeData } from "Services/NodesService";
import Node from "../Node";

export function CreateSetColorOverLife() {
    return AddNode(new ColorOverLifeAPI(), (data: NodeData) => {
        return <SetColorOverLife key={data.order === -1 ? `node_${data.node.id}` : `node_${data.order}_${data.node.id}`} data={data} />;
    });
}

function SetColorOverLife({ data }: { data: NodeData }) {
    return (
        <Node
            Name="Set Color Over Life"
            NodeId={data.node.id}
            NodeAnchorPoint={data.anchorPoint}
            IsConnectedToSystem={data.node.connectedSystemId !== undefined}
        >
            <ColorRampField Label={"Ramp"} Ramp={(data.node as ColorOverLifeAPI).nodeFields.ramp} />
        </Node>
    );
}
