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
    const [_, setForceRender] = useState(0);

    const calculationTypeRef = useRef((data.node as AddRotationAPI).nodeFields.calculationType);
    const axisTypeRef = useRef((data.node as AddRotationAPI).nodeFields.axisType);

    useEffect(() => {
        const connection1 = calculationTypeRef.current.FieldChanged.Connect(() => {
            setForceRender((prev) => prev + 1);

            task.spawn(() => {
                task.wait();
                setForceRender((prev) => prev + 1);
            });
        });

        const connection2 = axisTypeRef.current.FieldChanged.Connect(() => {
            setForceRender((prev) => prev + 1);

            task.spawn(() => {
                task.wait();
                setForceRender((prev) => prev + 1);
            });
        });

        return () => {
            connection1.Disconnect();
            connection2.Disconnect();
        };
    }, []);

    const isUniform = () => {
        return calculationTypeRef.current.GetState() === CalculationType.Uniform;
    };

    const isRandom = () => {
        return calculationTypeRef.current.GetState() === CalculationType.Random;
    };

    return (
        <Node
            Name="Add Rotation"
            NodeId={data.node.id}
            NodeAnchorPoint={data.anchorPoint}
            IsConnectedToSystem={data.node.connectedSystemId !== undefined}
        >
            <StateField NodeField={calculationTypeRef.current} />
            <StateField NodeField={axisTypeRef.current} />

            {IsAxisX(axisTypeRef.current.GetState()) && isUniform() && (
                <ConnectableNumberField
                    NodeId={data.node.id}
                    NodeField={(data.node as AddRotationAPI).nodeFields.rotationX}
                    NodeFieldName={AddRotationFieldNames.rotationX}
                    Label="X"
                />
            )}
            {IsAxisX(axisTypeRef.current.GetState()) && isRandom() && (
                <ConnectableVector2Field
                    NodeId={data.node.id}
                    NodeField={(data.node as AddRotationAPI).nodeFields.rangeX}
                    NodeFieldName={AddRotationFieldNames.rangeX}
                    Label="X"
                />
            )}

            {IsAxisY(axisTypeRef.current.GetState()) && isUniform() && (
                <ConnectableNumberField
                    NodeId={data.node.id}
                    NodeField={(data.node as AddRotationAPI).nodeFields.rotationY}
                    NodeFieldName={AddRotationFieldNames.rotationY}
                    Label="Y"
                />
            )}
            {IsAxisY(axisTypeRef.current.GetState()) && isRandom() && (
                <ConnectableVector2Field
                    NodeId={data.node.id}
                    NodeField={(data.node as AddRotationAPI).nodeFields.rangeY}
                    NodeFieldName={AddRotationFieldNames.rangeY}
                    Label="Y"
                />
            )}

            {IsAxisZ(axisTypeRef.current.GetState()) && isUniform() && (
                <ConnectableNumberField
                    NodeId={data.node.id}
                    NodeField={(data.node as AddRotationAPI).nodeFields.rotationZ}
                    NodeFieldName={AddRotationFieldNames.rotationZ}
                    Label="Z"
                />
            )}
            {IsAxisZ(axisTypeRef.current.GetState()) && isRandom() && (
                <ConnectableVector2Field
                    NodeId={data.node.id}
                    NodeField={(data.node as AddRotationAPI).nodeFields.rangeZ}
                    NodeFieldName={AddRotationFieldNames.rangeZ}
                    Label="Z"
                />
            )}
        </Node>
    );
}
