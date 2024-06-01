import React, { useEffect, useRef, useState } from "@rbxts/react";
import { CalculationType } from "API/Nodes/FieldStates";
import { IsAxisX, IsAxisY, IsAxisZ } from "API/Nodes/FieldStatesLib";
import { AddRotation as AddRotationAPI, AddRotationFieldNames } from "API/Nodes/Update/AddRotation";
import ConnectableNumberField from "Components/NodeFields/ConnectableNumberField";
import { ConnectableVector2Field } from "Components/NodeFields/ConnectableVector2Field";
import StateField from "Components/NodeFields/StateField";
import { AddNode, type NodeData } from "Services/NodesService";
import Node from "../Node";

export function CreateAddRotation() {
    return AddNode(new AddRotationAPI(), (data: NodeData) => {
        return (
            <AddRotationXYZ
                key={data.node.updateOrder === -1 ? `node_${data.node.id}` : `node_${data.node.updateOrder}_${data.node.id}`}
                data={data}
            />
        );
    });
}

function AddRotationXYZ({ data }: { data: NodeData }) {
    const calculationTypeRef = useRef((data.node as AddRotationAPI).nodeFields.calculationType);
    const axisTypeRef = useRef((data.node as AddRotationAPI).nodeFields.axisType);

    const isUniform = () => {
        return calculationTypeRef.current.GetState() === CalculationType.Uniform;
    };

    const isRandom = () => {
        return calculationTypeRef.current.GetState() === CalculationType.Random;
    };

    const axisType = axisTypeRef.current.GetState();

    return (
        <Node
            Name="Add Rotation"
            NodeId={data.node.id}
            NodeAnchorPoint={data.anchorPoint}
            IsConnectedToSystem={data.node.connectedSystemId !== undefined}
        >
            <StateField NodeField={calculationTypeRef.current} />
            <StateField NodeField={axisTypeRef.current} />

            {IsAxisX(axisType) && isUniform() && (
                <ConnectableNumberField
                    NodeId={data.node.id}
                    NodeField={(data.node as AddRotationAPI).nodeFields.rotationX}
                    NodeFieldName={AddRotationFieldNames.rotationX}
                    Label="X"
                />
            )}
            {IsAxisX(axisType) && isRandom() && (
                <ConnectableVector2Field
                    NodeId={data.node.id}
                    NodeField={(data.node as AddRotationAPI).nodeFields.rangeX}
                    NodeFieldName={AddRotationFieldNames.rangeX}
                    Label={IsAxisY(axisType) || IsAxisZ(axisType) ? "X" : undefined}
                    ValueLabels={["Min", "Max"]}
                />
            )}

            {IsAxisY(axisType) && isUniform() && (
                <ConnectableNumberField
                    NodeId={data.node.id}
                    NodeField={(data.node as AddRotationAPI).nodeFields.rotationY}
                    NodeFieldName={AddRotationFieldNames.rotationY}
                    Label="Y"
                />
            )}
            {IsAxisY(axisType) && isRandom() && (
                <ConnectableVector2Field
                    NodeId={data.node.id}
                    NodeField={(data.node as AddRotationAPI).nodeFields.rangeY}
                    NodeFieldName={AddRotationFieldNames.rangeY}
                    Label={IsAxisX(axisType) || IsAxisZ(axisType) ? "Y" : undefined}
                    ValueLabels={["Min", "Max"]}
                />
            )}

            {IsAxisZ(axisType) && isUniform() && (
                <ConnectableNumberField
                    NodeId={data.node.id}
                    NodeField={(data.node as AddRotationAPI).nodeFields.rotationZ}
                    NodeFieldName={AddRotationFieldNames.rotationZ}
                    Label="Z"
                />
            )}
            {IsAxisZ(axisType) && isRandom() && (
                <ConnectableVector2Field
                    NodeId={data.node.id}
                    NodeField={(data.node as AddRotationAPI).nodeFields.rangeZ}
                    NodeFieldName={AddRotationFieldNames.rangeZ}
                    Label={IsAxisX(axisType) || IsAxisY(axisType) ? "Z" : undefined}
                    ValueLabels={["Min", "Max"]}
                />
            )}
        </Node>
    );
}
