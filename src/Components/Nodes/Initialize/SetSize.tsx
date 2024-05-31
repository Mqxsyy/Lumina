import React, { useEffect, useRef, useState } from "@rbxts/react";
import { CalculationType } from "API/Nodes/FieldStates";
import { IsAxisX, IsAxisY, IsAxisZ } from "API/Nodes/FieldStatesLib";
import { SetSize as SetSizeAPI, SetSizeFieldNames } from "API/Nodes/Initialize/SetSize";
import ConnectableNumberField from "Components/NodeFields/ConnectableNumberField";
import { ConnectableVector2Field } from "Components/NodeFields/ConnectableVector2Field";
import StateField from "Components/NodeFields/StateField";
import { AddNode, type NodeData } from "Services/NodesService";
import Node from "../Node";

export function CreateSetSize() {
    return AddNode(new SetSizeAPI(), (data: NodeData) => {
        return (
            <SetSize
                key={data.node.updateOrder === -1 ? `node_${data.node.id}` : `node_${data.node.updateOrder}_${data.node.id}`}
                data={data}
            />
        );
    });
}

function SetSize({ data }: { data: NodeData }) {
    const [_, setForceRender] = useState(0);

    const calculationTypeRef = useRef((data.node as SetSizeAPI).nodeFields.calculationType);
    const axisTypeRef = useRef((data.node as SetSizeAPI).nodeFields.axisType);

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

    const isUniformConnected = () => {
        return calculationTypeRef.current.GetState() === CalculationType.UniformConnected;
    };

    const isUniform = () => {
        return calculationTypeRef.current.GetState() === CalculationType.Uniform;
    };

    const isRandom = () => {
        return calculationTypeRef.current.GetState() === CalculationType.Random;
    };

    const isRandomConnected = () => {
        return calculationTypeRef.current.GetState() === CalculationType.RandomConncted;
    };

    return (
        <Node
            Name="Set Size"
            NodeId={data.node.id}
            NodeAnchorPoint={data.anchorPoint}
            IsConnectedToSystem={data.node.connectedSystemId !== undefined}
        >
            <StateField NodeField={calculationTypeRef.current} />

            {!isRandomConnected() && !isUniformConnected() && <StateField NodeField={axisTypeRef.current} />}

            {isUniformConnected() && (
                <ConnectableNumberField
                    NodeId={data.node.id}
                    NodeField={(data.node as SetSizeAPI).nodeFields.size}
                    NodeFieldName={SetSizeFieldNames.size}
                    Label="Size"
                />
            )}

            {isRandomConnected() && (
                <ConnectableVector2Field
                    NodeId={data.node.id}
                    NodeField={(data.node as SetSizeAPI).nodeFields.range}
                    NodeFieldName={SetSizeFieldNames.range}
                    Label="Range"
                />
            )}

            {IsAxisX(axisTypeRef.current.GetState()) && isUniform() && (
                <ConnectableNumberField
                    NodeId={data.node.id}
                    NodeField={(data.node as SetSizeAPI).nodeFields.sizeX}
                    NodeFieldName={SetSizeFieldNames.sizeX}
                    Label="X"
                />
            )}
            {IsAxisX(axisTypeRef.current.GetState()) && isRandom() && (
                <ConnectableVector2Field
                    NodeId={data.node.id}
                    NodeField={(data.node as SetSizeAPI).nodeFields.rangeX}
                    NodeFieldName={SetSizeFieldNames.rangeX}
                    Label="X"
                />
            )}

            {IsAxisY(axisTypeRef.current.GetState()) && isUniform() && (
                <ConnectableNumberField
                    NodeId={data.node.id}
                    NodeField={(data.node as SetSizeAPI).nodeFields.sizeY}
                    NodeFieldName={SetSizeFieldNames.sizeY}
                    Label="Y"
                />
            )}
            {IsAxisY(axisTypeRef.current.GetState()) && isRandom() && (
                <ConnectableVector2Field
                    NodeId={data.node.id}
                    NodeField={(data.node as SetSizeAPI).nodeFields.rangeY}
                    NodeFieldName={SetSizeFieldNames.rangeY}
                    Label="Y"
                />
            )}

            {IsAxisZ(axisTypeRef.current.GetState()) && isUniform() && (
                <ConnectableNumberField
                    NodeId={data.node.id}
                    NodeField={(data.node as SetSizeAPI).nodeFields.sizeZ}
                    NodeFieldName={SetSizeFieldNames.sizeZ}
                    Label="Z"
                />
            )}
            {IsAxisZ(axisTypeRef.current.GetState()) && isRandom() && (
                <ConnectableVector2Field
                    NodeId={data.node.id}
                    NodeField={(data.node as SetSizeAPI).nodeFields.rangeZ}
                    NodeFieldName={SetSizeFieldNames.rangeZ}
                    Label="Z"
                />
            )}
        </Node>
    );
}
