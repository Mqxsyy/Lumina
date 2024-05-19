import React from "@rbxts/react";
import { SetSizeXYZ as SetSizeXYZAPI, SetSizeXYZFieldNames } from "API/Nodes/Initialize/SetSizeXYZ";
import { ConnectableVector3Field } from "Components/NodeFields/ConnectableVector3Field";
import { AddNode, NodeData } from "Services/NodesService";
import Node from "../Node";

export function CreateSetSizeXYZ() {
    return AddNode(new SetSizeXYZAPI(), (data: NodeData) => {
        return <SetSizeXYZ key={data.order === -1 ? `node_${data.node.id}` : `node_${data.order}_${data.node.id}`} data={data} />;
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
            <ConnectableVector3Field
                NodeId={data.node.id}
                NodeField={(data.node as SetSizeXYZAPI).nodeFields.size}
                NodeFieldName={SetSizeXYZFieldNames.size}
            />
        </Node>
    );
}
