import React, { useEffect, useState } from "@rbxts/react";
import { SpawnShape } from "API/Fields/SpawnShapeField";
import { AddPositionFromShape as AddPositionFromShapeAPI, AddPositionFromShapeFieldNames } from "API/Nodes/Initialize/AddPositionFromShape";
import BooleanField from "Components/NodeFields/BooleanField";
import ConnectableNumberField from "Components/NodeFields/ConnectableNumberField";
import { ConnectableVector2Field } from "Components/NodeFields/ConnectableVector2Field";
import { ConnectableVector3Field } from "Components/NodeFields/ConnectableVector3Field";
import SpawnShapeField from "Components/NodeFields/SpawnShapeField";
import { AddNode, type NodeData } from "Services/NodesService";
import Node from "../Node";

export function CreateAddPositionFromShape() {
    return AddNode(new AddPositionFromShapeAPI(), (data: NodeData) => {
        return (
            <AddPositionFromShape
                key={data.node.updateOrder === -1 ? `node_${data.node.id}` : `node_${data.node.updateOrder}_${data.node.id}`}
                data={data}
            />
        );
    });
}

function AddPositionFromShape({ data }: { data: NodeData }) {
    const [_, setForceRender] = useState(0);

    useEffect(() => {
        const connection = (data.node as AddPositionFromShapeAPI).nodeFields.spawnShape.FieldChanged.Connect(() => {
            setForceRender((prev) => prev + 1);
        });

        return () => {
            connection.Disconnect();
        };
    }, []);

    return (
        <Node
            Name="Add Position From Shape"
            NodeId={data.node.id}
            NodeAnchorPoint={data.anchorPoint}
            IsConnectedToSystem={data.node.connectedSystemId !== undefined}
        >
            <SpawnShapeField NodeField={(data.node as AddPositionFromShapeAPI).nodeFields.spawnShape} Label="Spawn Shape" />

            {(data.node as AddPositionFromShapeAPI).nodeFields.spawnShape.GetSpawnShape() === SpawnShape.Square && (
                <ConnectableVector2Field
                    NodeId={data.node.id}
                    NodeField={(data.node as AddPositionFromShapeAPI).nodeFields.sizeVec2}
                    NodeFieldName={AddPositionFromShapeFieldNames.sizeVec2}
                    Label="Square Size"
                    ValueLabels={["Width", "Height"]}
                    AllowNegatives={[false, false]}
                />
            )}
            {(data.node as AddPositionFromShapeAPI).nodeFields.spawnShape.GetSpawnShape() === SpawnShape.Cube && (
                <ConnectableVector3Field
                    NodeId={data.node.id}
                    NodeField={(data.node as AddPositionFromShapeAPI).nodeFields.sizeVec3}
                    NodeFieldName={AddPositionFromShapeFieldNames.sizeVec3}
                    Label="Cube Size"
                    ValueLabels={["Width", "Height", "Length"]}
                    AllowNegatives={[false, false, false]}
                />
            )}
            {(data.node as AddPositionFromShapeAPI).nodeFields.spawnShape.GetSpawnShape() === SpawnShape.Ellipse && (
                <ConnectableVector2Field
                    NodeId={data.node.id}
                    NodeField={(data.node as AddPositionFromShapeAPI).nodeFields.sizeVec2}
                    NodeFieldName={AddPositionFromShapeFieldNames.sizeVec2}
                    Label="Ellipse Size"
                    ValueLabels={["Width", "Height"]}
                    AllowNegatives={[false, false]}
                />
            )}
            {(data.node as AddPositionFromShapeAPI).nodeFields.spawnShape.GetSpawnShape() === SpawnShape.Sphere && (
                <ConnectableVector3Field
                    NodeId={data.node.id}
                    NodeField={(data.node as AddPositionFromShapeAPI).nodeFields.sizeVec3}
                    NodeFieldName={AddPositionFromShapeFieldNames.sizeVec3}
                    Label="Sphere Size"
                    ValueLabels={["Width", "Height", "Length"]}
                    AllowNegatives={[false, false, false]}
                />
            )}

            <ConnectableNumberField
                NodeId={data.node.id}
                NodeField={(data.node as AddPositionFromShapeAPI).nodeFields.edgeWidth}
                NodeFieldName={AddPositionFromShapeFieldNames.edgeWidth}
                Label="Edge Width"
            />
            <ConnectableVector3Field
                NodeId={data.node.id}
                NodeField={(data.node as AddPositionFromShapeAPI).nodeFields.rotation}
                NodeFieldName={AddPositionFromShapeFieldNames.rotation}
                Label="Rotation"
                ValueLabels={["X", "Y", "Z"]}
            />
            <BooleanField NodeField={(data.node as AddPositionFromShapeAPI).nodeFields.filled} Label="Filled" />
        </Node>
    );
}
