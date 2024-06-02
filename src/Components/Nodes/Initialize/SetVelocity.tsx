import React, { useEffect, useRef, useState } from "@rbxts/react";
import { CalculationType } from "API/Nodes/FieldStates";
import { IsAxisX, IsAxisY, IsAxisZ } from "API/Nodes/FieldStatesLib";
import { SetVelocity as SetVelocityAPI, SetVelocityFieldNames } from "API/Nodes/Initialize/SetVelocity";
import ConnectableNumberField from "Components/NodeFields/ConnectableNumberField";
import { ConnectableVector2Field } from "Components/NodeFields/ConnectableVector2Field";
import StateField from "Components/NodeFields/StateField";
import { AddNode, type NodeData } from "Services/NodesService";
import Node from "../Node";

export function CreateSetVelocity() {
    return AddNode(new SetVelocityAPI(), (data: NodeData) => {
        return (
            <SetVelocity
                key={data.node.updateOrder === -1 ? `node_${data.node.id}` : `node_${data.node.updateOrder}_${data.node.id}`}
                data={data}
            />
        );
    });
}

function SetVelocity({ data }: { data: NodeData }) {
    const [_, setForceRender] = useState(0);

    const calculationTypeRef = useRef((data.node as SetVelocityAPI).nodeFields.calculationType);
    const axisTypeRef = useRef((data.node as SetVelocityAPI).nodeFields.axisType);

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
        return calculationTypeRef.current.GetState() === CalculationType.Uniform;
    };

    const isRandom = () => {
        return calculationTypeRef.current.GetState() === CalculationType.Random;
    };

    const axisType = axisTypeRef.current.GetState();

    return (
        <Node
            Name="Set Velocity"
            NodeId={data.node.id}
            NodeAnchorPoint={data.anchorPoint}
            IsConnectedToSystem={data.node.connectedSystemId !== undefined}
        >
            <StateField NodeField={calculationTypeRef.current} />
            <StateField NodeField={axisTypeRef.current} />

            {IsAxisX(axisType) && isUniform() && (
                <ConnectableNumberField
                    NodeId={data.node.id}
                    NodeField={(data.node as SetVelocityAPI).nodeFields.velocityX}
                    NodeFieldName={SetVelocityFieldNames.velocityX}
                    Label="X"
                />
            )}
            {IsAxisX(axisType) && isRandom() && (
                <ConnectableVector2Field
                    NodeId={data.node.id}
                    NodeField={(data.node as SetVelocityAPI).nodeFields.rangeX}
                    NodeFieldName={SetVelocityFieldNames.rangeX}
                    Label={IsAxisY(axisType) || IsAxisZ(axisType) ? "Range X" : "Range"}
                    ValueLabels={["Min", "Max"]}
                />
            )}

            {IsAxisY(axisType) && isUniform() && (
                <ConnectableNumberField
                    NodeId={data.node.id}
                    NodeField={(data.node as SetVelocityAPI).nodeFields.velocityY}
                    NodeFieldName={SetVelocityFieldNames.velocityY}
                    Label="Y"
                />
            )}
            {IsAxisY(axisType) && isRandom() && (
                <ConnectableVector2Field
                    NodeId={data.node.id}
                    NodeField={(data.node as SetVelocityAPI).nodeFields.rangeY}
                    NodeFieldName={SetVelocityFieldNames.rangeY}
                    Label={IsAxisX(axisType) || IsAxisZ(axisType) ? "Range Y" : "Range"}
                    ValueLabels={["Min", "Max"]}
                />
            )}

            {IsAxisZ(axisType) && isUniform() && (
                <ConnectableNumberField
                    NodeId={data.node.id}
                    NodeField={(data.node as SetVelocityAPI).nodeFields.velocityZ}
                    NodeFieldName={SetVelocityFieldNames.velocityZ}
                    Label="Z"
                />
            )}
            {IsAxisZ(axisType) && isRandom() && (
                <ConnectableVector2Field
                    NodeId={data.node.id}
                    NodeField={(data.node as SetVelocityAPI).nodeFields.rangeZ}
                    NodeFieldName={SetVelocityFieldNames.rangeZ}
                    Label={IsAxisX(axisType) || IsAxisY(axisType) ? "Range Z" : "Range"}
                    ValueLabels={["Min", "Max"]}
                />
            )}
        </Node>
    );
}
