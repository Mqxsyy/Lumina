import React from "@rbxts/react";
import { CapitalizeFirstLetter } from "API/Lib";
import { SetRotationZ as SetRotationZAPI, SetRotationZFieldNames } from "API/Nodes/Initialize/SetRotationZ";
import ConnectableNumberField from "Components/NodeFields/ConnectableNumberField";
import { AddNode, type NodeData } from "Services/NodesService";
import Node from "../Node";

export function CreateSetRotationZ() {
    return AddNode(new SetRotationZAPI(), (data: NodeData) => {
        return <SetRotationZ key={data.order === -1 ? `node_${data.node.id}` : `node_${data.order}_${data.node.id}`} data={data} />;
    });
}

function SetRotationZ({ data }: { data: NodeData }) {
    return (
        <Node
            Name="Set Rotation Z"
            NodeId={data.node.id}
            NodeAnchorPoint={data.anchorPoint}
            IsConnectedToSystem={data.node.connectedSystemId !== undefined}
        >
            <ConnectableNumberField
                NodeId={data.node.id}
                NodeField={(data.node as SetRotationZAPI).nodeFields.rotation}
                NodeFieldName={SetRotationZFieldNames.rotation}
                Label={CapitalizeFirstLetter(SetRotationZFieldNames.rotation)}
                AllowNegative={true}
            />
        </Node>
    );
}
