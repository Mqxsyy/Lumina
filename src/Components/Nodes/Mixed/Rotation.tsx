import React, { useEffect, useRef, useState } from "@rbxts/react";
import { CalculationType1 } from "API/Nodes/FieldStates";
import { IsAxisX, IsAxisY, IsAxisZ } from "API/Nodes/FieldStatesLib";
import { Rotation as RotationAPI } from "API/Nodes/Mixed/Rotation";
import ConnectableNumberField from "Components/NodeFields/ConnectableNumberField";
import { ConnectableVector2Field } from "Components/NodeFields/ConnectableVector2Field";
import StateField from "Components/NodeFields/StateField";
import { AddNode, type NodeData } from "Services/NodesService";
import Node from "../Node";

export function CreateRotation() {
    return AddNode(new RotationAPI(), (data: NodeData) => {
        return (
            <Rotation
                key={data.node.updateOrder === -1 ? `node_${data.node.id}` : `node_${data.node.updateOrder}_${data.node.id}`}
                data={data}
            />
        );
    });
}

function Rotation({ data }: { data: NodeData }) {
    const [_, setForceRender] = useState(0);

    const calculationTypeRef = useRef((data.node as RotationAPI).nodeFields.calculationType);
    const axisTypeRef = useRef((data.node as RotationAPI).nodeFields.axisType);

    useEffect(() => {
        const connection1 = calculationTypeRef.current.FieldChanged.Connect(() => {
            task.wait();
            setForceRender((prev) => prev + 1);
        });

        const connection2 = axisTypeRef.current.FieldChanged.Connect(() => {
            task.wait();
            setForceRender((prev) => prev + 1);
        });

        return () => {
            connection1.Disconnect();
            connection2.Disconnect();
        };
    }, []);

    const isUniform = () => {
        return calculationTypeRef.current.GetState() === CalculationType1.Uniform;
    };

    const isRandom = () => {
        return calculationTypeRef.current.GetState() === CalculationType1.Random;
    };

    const axisType = axisTypeRef.current.GetState();

    return (
        <Node
            Name="Set Rotation"
            NodeId={data.node.id}
            NodeAnchorPoint={data.anchorPoint}
            IsConnectedToSystem={data.node.connectedSystemId !== undefined}
        >
            <StateField NodeField={(data.node as RotationAPI).nodeFields.nodeOperationType} />
            <StateField NodeField={calculationTypeRef.current} />
            <StateField NodeField={axisTypeRef.current} />

            {IsAxisX(axisType) && isUniform() && (
                <ConnectableNumberField
                    NodeId={data.node.id}
                    NodeField={(data.node as RotationAPI).nodeFields.rotationX}
                    NodeFieldName={"rotationX"}
                    Label="X"
                />
            )}
            {IsAxisX(axisType) && isRandom() && (
                <ConnectableVector2Field
                    NodeId={data.node.id}
                    NodeField={(data.node as RotationAPI).nodeFields.rangeX}
                    NodeFieldName={"rangeX"}
                    Label={IsAxisY(axisType) || IsAxisZ(axisType) ? "Range X" : "Range"}
                    ValueLabels={["Min", "Max"]}
                />
            )}

            {IsAxisY(axisType) && isUniform() && (
                <ConnectableNumberField
                    NodeId={data.node.id}
                    NodeField={(data.node as RotationAPI).nodeFields.rotationY}
                    NodeFieldName={"rotationY"}
                    Label="Y"
                />
            )}
            {IsAxisY(axisType) && isRandom() && (
                <ConnectableVector2Field
                    NodeId={data.node.id}
                    NodeField={(data.node as RotationAPI).nodeFields.rangeY}
                    NodeFieldName={"rangeY"}
                    Label={IsAxisX(axisType) || IsAxisZ(axisType) ? "Range Y" : "Range"}
                    ValueLabels={["Min", "Max"]}
                />
            )}

            {IsAxisZ(axisType) && isUniform() && (
                <ConnectableNumberField
                    NodeId={data.node.id}
                    NodeField={(data.node as RotationAPI).nodeFields.rotationZ}
                    NodeFieldName={"rotationZ"}
                    Label="Z"
                />
            )}
            {IsAxisZ(axisType) && isRandom() && (
                <ConnectableVector2Field
                    NodeId={data.node.id}
                    NodeField={(data.node as RotationAPI).nodeFields.rangeZ}
                    NodeFieldName={"rangeZ"}
                    Label={IsAxisX(axisType) || IsAxisY(axisType) ? "Range Z" : "Range"}
                    ValueLabels={["Min", "Max"]}
                />
            )}
        </Node>
    );
}
