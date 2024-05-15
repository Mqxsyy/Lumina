import React from "@rbxts/react";
import { SetSizeXYZ as SetSizeXYZAPI, SetSizeXYZFieldNames } from "API/Nodes/Initialize/SetSizeXYZ";
import { Vector3Field } from "Components/NodeFields/Vector3Field";
import { AddNode, NodeData } from "Services/NodesService";
import Node from "../Node";

export function CreateSetSizeXYZ() {
    return AddNode(new SetSizeXYZAPI(), (data: NodeData) => {
        return <SetSizeXYZ key={`node_${data.node.id}`} data={data} />;
    });
}

function SetSizeXYZ({ data }: { data: NodeData }) {
    return (
        <Node
            Name="Set Size XYZ"
            NodeId={data.node.id}
            NodeAnchorPoint={data.anchorPoint}
            IsConnectedToSystem={data.node.connectedSystemId !== undefined}
        >
            <Vector3Field
                NodeId={data.node.id}
                NodeField={(data.node as SetSizeXYZAPI).nodeFields.size}
                NodeFieldName={SetSizeXYZFieldNames.size}
            />
        </Node>
    );
}
