import React, { useRef } from "@rbxts/react";
import { SetTransparencyOverLife as TransparencyOverLifeAPI } from "API/Nodes/Update/SetTransparencyOverLife";
import { LineGraphField } from "Components/NodeFields/LineGraphField";
import { AddNode, type NodeData } from "Services/NodesService";
import Node from "../Node";

export function CreateSetTransparencyOverLife() {
    return AddNode(new TransparencyOverLifeAPI(), (data: NodeData) => {
        return (
            <SetTransparencyOverLife
                key={data.node.updateOrder === -1 ? `node_${data.node.id}` : `node_${data.node.updateOrder}_${data.node.id}`}
                data={data}
            />
        );
    });
}

function SetTransparencyOverLife({ data }: { data: NodeData }) {
    const graphFieldRef = useRef((data.node as TransparencyOverLifeAPI).nodeFields.graph);

    return (
        <Node
            Name="Set Transparency Over Life"
            NodeId={data.node.id}
            NodeAnchorPoint={data.anchorPoint}
            IsConnectedToSystem={data.node.connectedSystemId !== undefined}
        >
            <LineGraphField Label={"Graph"} Graph={graphFieldRef.current} />
        </Node>
    );
}
