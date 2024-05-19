import React from "@rbxts/react";
import { SetPositionByShape as SetPositionByShapeAPI, SetPositionByShapeFieldNames } from "API/Nodes/Initialize/SetPositionByShape";
import BooleanField from "Components/NodeFields/BooleanField";
import ConnectableNumberField from "Components/NodeFields/ConnectableNumberField";
import { ConnectableVector2Field } from "Components/NodeFields/ConnectableVector2Field";
import SpawnShapeField from "Components/NodeFields/SpawnShapeField";
import { AddNode, type NodeData } from "Services/NodesService";
import Node from "../Node";

export function CreateSetPositionByShape() {
    return AddNode(new SetPositionByShapeAPI(), (data: NodeData) => {
        return <SetPosition key={data.order === -1 ? `node_${data.node.id}` : `node_${data.order}_${data.node.id}`} data={data} />;
    });
}

function SetPosition({ data }: { data: NodeData }) {
    return (
        <Node
            Name="Set Position By Shape"
            NodeId={data.node.id}
            NodeAnchorPoint={data.anchorPoint}
            IsConnectedToSystem={data.node.connectedSystemId !== undefined}
        >
            <SpawnShapeField NodeField={(data.node as SetPositionByShapeAPI).nodeFields.spawnShape} Label="Spawn Shape" />
            <ConnectableVector2Field
                NodeId={data.node.id}
                NodeField={(data.node as SetPositionByShapeAPI).nodeFields.squareSize}
                NodeFieldName={SetPositionByShapeFieldNames.squareSize}
                Label="Square Size"
                ValueLabels={["Width", "Height"]}
                AllowNegatives={[false, false]}
            />
            <BooleanField NodeField={(data.node as SetPositionByShapeAPI).nodeFields.filled} Label="Filled" />
            <ConnectableNumberField
                NodeId={data.node.id}
                NodeField={(data.node as SetPositionByShapeAPI).nodeFields.edgeWidth}
                NodeFieldName={SetPositionByShapeFieldNames.edgeWidth}
                Label="Edge Width"
            />
        </Node>
    );
}
