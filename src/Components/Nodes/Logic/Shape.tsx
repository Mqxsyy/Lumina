import React, { useEffect, useState } from "@rbxts/react";
import { SpawnShapeType, ValueType } from "API/Nodes/FieldStates";
import { Shape as ShapeAPI } from "API/Nodes/Logic/Shape";
import Div from "Components/Div";
import BooleanField from "Components/NodeFields/BooleanField";
import ConnectableNumberField from "Components/NodeFields/ConnectableNumberField";
import { ConnectableVector2Field } from "Components/NodeFields/ConnectableVector2Field";
import ConnectableVector3Field from "Components/NodeFields/ConnectableVector3Field";
import NumberField from "Components/NodeFields/NumberField";
import StateField from "Components/NodeFields/StateField";
import { AddNode, type NodeData } from "Services/NodesService";
import { GetZoomScale } from "ZoomScale";
import Node from "../Node";

export function CreateShape() {
    return AddNode(new ShapeAPI(), (data: NodeData) => {
        return (
            <Shape
                key={data.node.updateOrder === -1 ? `node_${data.node.id}` : `node_${data.node.updateOrder}_${data.node.id}`}
                data={data}
            />
        );
    });
}

function Shape({ data }: { data: NodeData }) {
    const [_, setForceRender] = useState(0);

    const zoomScale = GetZoomScale();

    const shapeType = (data.node as ShapeAPI).nodeFields.spawnShape.GetState();
    const edgeWidth = (data.node as ShapeAPI).nodeFields.edgeWidth.GetNumber();
    const isFilled = (data.node as ShapeAPI).nodeFields.filled.GetBoolean();
    const spacing = (data.node as ShapeAPI).nodeFields.spacing.GetNumber();

    useEffect(() => {
        const connection1 = (data.node as ShapeAPI).nodeFields.spawnShape.FieldChanged.Connect(() => {
            setForceRender((prev) => prev + 1);
        });

        const connection2 = (data.node as ShapeAPI).nodeFields.filled.FieldChanged.Connect(() => {
            setForceRender((prev) => prev + 1);
        });

        const connection3 = (data.node as ShapeAPI).nodeFields.edgeWidth.FieldChanged.Connect(() => {
            setForceRender((prev) => prev + 1);
        });

        const connection4 = (data.node as ShapeAPI).nodeFields.spacing.FieldChanged.Connect(() => {
            setForceRender((prev) => prev + 1);
        });

        return () => {
            connection1.Disconnect();
            connection2.Disconnect();
            connection3.Disconnect();
            connection4.Disconnect();
        };
    }, []);

    return (
        <Node
            Name="Shape"
            NodeId={data.node.id}
            NodeAnchorPoint={data.anchorPoint}
            IsConnectedToSystem={data.node.connectedSystemId !== undefined}
            ConnectionValueType={ValueType.Vector3}
        >
            <StateField NodeField={(data.node as ShapeAPI).nodeFields.spawnShape} />

            <Div Size={UDim2.fromScale(1, 0)} AutomaticSize="Y">
                <uilistlayout Padding={new UDim(0, 5 * zoomScale)} HorizontalAlignment={"Center"} />

                {shapeType === SpawnShapeType.Square && (
                    <ConnectableVector2Field
                        NodeId={data.node.id}
                        NodeField={(data.node as ShapeAPI).nodeFields.sizeVec2}
                        NodeFieldName={"sizeVec2"}
                        Label="Square Size"
                        ValueLabels={["Width", "Height"]}
                        AllowNegatives={[false, false]}
                    />
                )}
                {shapeType === SpawnShapeType.Cube && (
                    <ConnectableVector3Field
                        NodeId={data.node.id}
                        NodeField={(data.node as ShapeAPI).nodeFields.sizeVec3}
                        NodeFieldName={"sizeVec3"}
                        Label="Cube Size"
                        ValueLabels={["Width", "Height", "Length"]}
                        AllowNegatives={[false, false, false]}
                    />
                )}
                {shapeType === SpawnShapeType.Ellipse && (
                    <ConnectableVector2Field
                        NodeId={data.node.id}
                        NodeField={(data.node as ShapeAPI).nodeFields.sizeVec2}
                        NodeFieldName={"sizeVec2"}
                        Label="Ellipse Size"
                        ValueLabels={["Width", "Height"]}
                        AllowNegatives={[false, false]}
                    />
                )}
                {shapeType === SpawnShapeType.Sphere && (
                    <ConnectableVector3Field
                        NodeId={data.node.id}
                        NodeField={(data.node as ShapeAPI).nodeFields.sizeVec3}
                        NodeFieldName={"sizeVec3"}
                        Label="Sphere Size"
                        ValueLabels={["Width", "Height", "Length"]}
                        AllowNegatives={[false, false, false]}
                    />
                )}
            </Div>

            <ConnectableVector3Field
                NodeId={data.node.id}
                NodeField={(data.node as ShapeAPI).nodeFields.rotation}
                NodeFieldName={"rotation"}
                Label="Rotation"
                ValueLabels={["X", "Y", "Z"]}
            />

            <Div Size={UDim2.fromScale(1, 0)} AutomaticSize="Y">
                <uilistlayout Padding={new UDim(0, 5 * zoomScale)} HorizontalAlignment={"Center"} />

                {shapeType === SpawnShapeType.Ellipse && (
                    <NumberField NodeId={data.node.id} NodeField={(data.node as ShapeAPI).nodeFields.radius} Label="Radius" />
                )}

                {shapeType === SpawnShapeType.Ellipse && edgeWidth === 0 && !isFilled && (
                    <NumberField NodeId={data.node.id} NodeField={(data.node as ShapeAPI).nodeFields.spacing} Label="Spacing" />
                )}

                {shapeType === SpawnShapeType.Ellipse && spacing === 0 && (
                    <Div Size={UDim2.fromScale(1, 0)} AutomaticSize="Y">
                        <uilistlayout Padding={new UDim(0, 5 * zoomScale)} HorizontalAlignment={"Center"} />

                        <NumberField NodeId={data.node.id} NodeField={(data.node as ShapeAPI).nodeFields.edgeWidth} Label="Edge Width" />
                        <BooleanField NodeField={(data.node as ShapeAPI).nodeFields.filled} Label="Filled" />
                    </Div>
                )}

                {shapeType !== SpawnShapeType.Ellipse && (
                    <Div Size={UDim2.fromScale(1, 0)} AutomaticSize="Y">
                        <uilistlayout Padding={new UDim(0, 5 * zoomScale)} HorizontalAlignment={"Center"} />

                        <NumberField NodeId={data.node.id} NodeField={(data.node as ShapeAPI).nodeFields.edgeWidth} Label="Edge Width" />
                        <BooleanField NodeField={(data.node as ShapeAPI).nodeFields.filled} Label="Filled" />
                    </Div>
                )}
            </Div>
        </Node>
    );
}
