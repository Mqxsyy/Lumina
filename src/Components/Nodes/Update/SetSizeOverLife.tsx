import React, { useRef } from "@rbxts/react";
import { SetSizeOverLife as SizeOverLifeAPI } from "API/Nodes/Update/SetSizeOverLife";
import { LineGraphField } from "Components/NodeFields/LineGraphField";
import { AddNode, NodeData } from "Services/NodesService";
import Node from "../Node";

export function CreateSetSizeOverLife() {
    return AddNode(new SizeOverLifeAPI(), (data: NodeData) => {
        return <SetSizeOverLife key={`node_${data.node.id}`} data={data} />;
    });
}

function SetSizeOverLife({ data }: { data: NodeData }) {
    const graphFieldRef = useRef((data.node as SizeOverLifeAPI).nodeFields.graph);

    return (
        <Node
            Name="Set Size Over Life"
            NodeId={data.node.id}
            NodeAnchorPoint={data.anchorPoint}
            IsConnectedToSystem={data.node.connectedSystemId !== undefined}
        >
            <LineGraphField Label={"Graph"} Graph={graphFieldRef.current} MaxValue={10} />
        </Node>
    );
}
