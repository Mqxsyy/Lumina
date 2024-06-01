import React, { useEffect, useRef, useState } from "@rbxts/react";
import { CalculationType } from "API/Nodes/FieldStates";
import { IsAxisX, IsAxisY, IsAxisZ } from "API/Nodes/FieldStatesLib";
import { SetSize as SetSizeAPI, SetSizeFieldNames } from "API/Nodes/Initialize/SetSize";
import Div from "Components/Div";
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

    const axisType = axisTypeRef.current.GetState();

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
                    ValueLabels={["Min", "Max"]}
                />
            )}

            {IsAxisX(axisType) && !isUniformConnected() && !isRandomConnected() && (
                <Div Size={UDim2.fromScale(1, 0)} AutomaticSize="Y">
                    {isUniform() && (
                        <ConnectableNumberField
                            NodeId={data.node.id}
                            NodeField={(data.node as SetSizeAPI).nodeFields.sizeX}
                            NodeFieldName={SetSizeFieldNames.sizeX}
                            Label="X"
                        />
                    )}
                    {isRandom() && (
                        <ConnectableVector2Field
                            NodeId={data.node.id}
                            NodeField={(data.node as SetSizeAPI).nodeFields.rangeX}
                            NodeFieldName={SetSizeFieldNames.rangeX}
                            Label="X"
                            ValueLabels={["Min", "Max"]}
                        />
                    )}
                </Div>
            )}

            {IsAxisY(axisType) && !isUniformConnected() && !isRandomConnected() && (
                <Div Size={UDim2.fromScale(1, 0)} AutomaticSize="Y">
                    {isUniform() && (
                        <ConnectableNumberField
                            NodeId={data.node.id}
                            NodeField={(data.node as SetSizeAPI).nodeFields.sizeY}
                            NodeFieldName={SetSizeFieldNames.sizeY}
                            Label="Y"
                        />
                    )}
                    {isRandom() && (
                        <ConnectableVector2Field
                            NodeId={data.node.id}
                            NodeField={(data.node as SetSizeAPI).nodeFields.rangeY}
                            NodeFieldName={SetSizeFieldNames.rangeY}
                            Label="Y"
                            ValueLabels={["Min", "Max"]}
                        />
                    )}
                </Div>
            )}

            {IsAxisZ(axisType) && !isUniformConnected() && !isRandomConnected() && (
                <Div Size={UDim2.fromScale(1, 0)} AutomaticSize="Y">
                    {isUniform() && (
                        <ConnectableNumberField
                            NodeId={data.node.id}
                            NodeField={(data.node as SetSizeAPI).nodeFields.sizeZ}
                            NodeFieldName={SetSizeFieldNames.sizeZ}
                            Label="Z"
                        />
                    )}
                    {isRandom() && (
                        <ConnectableVector2Field
                            NodeId={data.node.id}
                            NodeField={(data.node as SetSizeAPI).nodeFields.rangeZ}
                            NodeFieldName={SetSizeFieldNames.rangeZ}
                            Label="Z"
                            ValueLabels={["Min", "Max"]}
                        />
                    )}
                </Div>
            )}
        </Node>
    );
}
