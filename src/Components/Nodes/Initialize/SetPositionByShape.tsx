import React, { useEffect, useState } from "@rbxts/react";
import { SpawnShape } from "API/Fields/SpawnShapeField";
import { SetPositionByShape as SetPositionByShapeAPI, SetPositionByShapeFieldNames } from "API/Nodes/Initialize/SetPositionByShape";
import BooleanField from "Components/NodeFields/BooleanField";
import ConnectableNumberField from "Components/NodeFields/ConnectableNumberField";
import { ConnectableVector2Field } from "Components/NodeFields/ConnectableVector2Field";
import { ConnectableVector3Field } from "Components/NodeFields/ConnectableVector3Field";
import SpawnShapeField from "Components/NodeFields/SpawnShapeField";
import { AddNode, type NodeData } from "Services/NodesService";
import Node from "../Node";

export function CreateSetPositionByShape() {
    return AddNode(new SetPositionByShapeAPI(), (data: NodeData) => {
        return <SetPosition key={data.order === -1 ? `node_${data.node.id}` : `node_${data.order}_${data.node.id}`} data={data} />;
    });
}

function SetPosition({ data }: { data: NodeData }) {
    const [_, setForceRender] = useState(0);

    useEffect(() => {
        const connection = (data.node as SetPositionByShapeAPI).nodeFields.spawnShape.FieldChanged.Connect(() => {
            setForceRender((prev) => prev + 1);
        });

        return () => {
            connection.Disconnect();
        };
    }, []);

    return (
        <Node
            Name="Set Position By Shape"
            NodeId={data.node.id}
            NodeAnchorPoint={data.anchorPoint}
            IsConnectedToSystem={data.node.connectedSystemId !== undefined}
        >
            <SpawnShapeField NodeField={(data.node as SetPositionByShapeAPI).nodeFields.spawnShape} Label="Spawn Shape" />

            {(data.node as SetPositionByShapeAPI).nodeFields.spawnShape.GetSpawnShape() === SpawnShape.Square && (
                <ConnectableVector2Field
                    NodeId={data.node.id}
                    NodeField={(data.node as SetPositionByShapeAPI).nodeFields.squareSize}
                    NodeFieldName={SetPositionByShapeFieldNames.squareSize}
                    Label="Square Size"
                    ValueLabels={["Width", "Height"]}
                    AllowNegatives={[false, false]}
                />
            )}
            {(data.node as SetPositionByShapeAPI).nodeFields.spawnShape.GetSpawnShape() === SpawnShape.Cube && (
                <ConnectableVector3Field
                    NodeId={data.node.id}
                    NodeField={(data.node as SetPositionByShapeAPI).nodeFields.cubeSize}
                    NodeFieldName={SetPositionByShapeFieldNames.cubeSize}
                    Label="Cube Size"
                    ValueLabels={["Width", "Height", "Length"]}
                    AllowNegatives={[false, false, false]}
                />
            )}

            <BooleanField NodeField={(data.node as SetPositionByShapeAPI).nodeFields.filled} Label="Filled" />
            <ConnectableNumberField
                NodeId={data.node.id}
                NodeField={(data.node as SetPositionByShapeAPI).nodeFields.edgeWidth}
                NodeFieldName={SetPositionByShapeFieldNames.edgeWidth}
                Label="Edge Width"
            />
            <ConnectableVector3Field
                NodeId={data.node.id}
                NodeField={(data.node as SetPositionByShapeAPI).nodeFields.rotation}
                NodeFieldName={SetPositionByShapeFieldNames.rotation}
                Label="Rotation"
                ValueLabels={["X", "Y", "Z"]}
            />
        </Node>
    );
}
