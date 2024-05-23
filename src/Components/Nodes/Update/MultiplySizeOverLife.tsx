import React, { useRef } from "@rbxts/react";
import { MultiplySizeOverLife as MultiplySizeOverLifeAPI } from "API/Nodes/Update/MultiplySizeOverLife";
import { LineGraphField } from "Components/NodeFields/LineGraphField";
import { AddNode, type NodeData } from "Services/NodesService";
import Node from "../Node";

export function CreateMultiplySizeOverLife() {
    return AddNode(new MultiplySizeOverLifeAPI(), (data: NodeData) => {
        return <MultiplySizeOverLife key={data.order === -1 ? `node_${data.node.id}` : `node_${data.order}_${data.node.id}`} data={data} />;
    });
}

function MultiplySizeOverLife({ data }: { data: NodeData }) {
    const graphFieldRef = useRef((data.node as MultiplySizeOverLifeAPI).nodeFields.graph);

    return (
        <Node
            Name="Multiple Size Over Life"
            NodeId={data.node.id}
            NodeAnchorPoint={data.anchorPoint}
            IsConnectedToSystem={data.node.connectedSystemId !== undefined}
        >
            <LineGraphField Label={"Graph"} Graph={graphFieldRef.current} MaxValue={10} />
        </Node>
    );
}
