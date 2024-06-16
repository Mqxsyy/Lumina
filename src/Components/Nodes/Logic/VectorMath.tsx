import React, { useEffect, useRef, useState } from "@rbxts/react";
import { MathOperationType, ValueType } from "API/Nodes/FieldStates";
import { VectorMath as VectorMathAPI } from "API/Nodes/Logic/VectorMath";
import ConnectableNumberField from "Components/NodeFields/ConnectableNumberField";
import { ConnectableVector2Field } from "Components/NodeFields/ConnectableVector2Field";
import ConnectableVector3Field from "Components/NodeFields/ConnectableVector3Field";
import { AddNode, type NodeData } from "Services/NodesService";
import Node from "../Node";

export function CreateVectorMath(operationType: string = MathOperationType.Add) {
    return AddNode(new VectorMathAPI(operationType), (data: NodeData) => {
        return (
            <VectorMath
                key={data.node.updateOrder === -1 ? `node_${data.node.id}` : `node_${data.node.updateOrder}_${data.node.id}`}
                data={data}
            />
        );
    });
}

function VectorMath({ data }: { data: NodeData }) {
    const [_, setForceRender] = useState(0);

    const valueTypeARef = useRef((data.node as VectorMathAPI).nodeFields.valueTypeA);
    const valueTypeB1Ref = useRef((data.node as VectorMathAPI).nodeFields.valueTypeB1);
    const valueTypeB2Ref = useRef((data.node as VectorMathAPI).nodeFields.valueTypeB2);
    const operationTypeRef = useRef((data.node as VectorMathAPI).nodeFields.operationType);

    const valueTypeA = valueTypeARef.current.GetState();
    const valueTypeB1 = valueTypeB1Ref.current.GetState();
    const valueTypeB2 = valueTypeB2Ref.current.GetState();
    const operationType = operationTypeRef.current.GetState();

    useEffect(() => {
        const connection1 = valueTypeARef.current.FieldChanged.Connect(() => {
            task.wait();
            setForceRender((prev) => prev + 1);
        });

        const connection2 = valueTypeB1Ref.current.FieldChanged.Connect(() => {
            task.wait();
            setForceRender((prev) => prev + 1);
        });

        const connection3 = valueTypeB2Ref.current.FieldChanged.Connect(() => {
            task.wait();
            setForceRender((prev) => prev + 1);
        });

        const connection4 = operationTypeRef.current.FieldChanged.Connect(() => {
            task.wait();
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
            Name="Vector Math"
            NodeId={data.node.id}
            NodeAnchorPoint={data.anchorPoint}
            IsConnectedToSystem={data.node.connectedSystemId !== undefined}
            Types={
                (operationType === MathOperationType.Multiply || operationType === MathOperationType.Divide) &&
                valueTypeA === ValueType.Vector2
                    ? [
                          {
                              field: valueTypeARef.current,
                              order: 1,
                          },
                          {
                              field: operationTypeRef.current,
                              order: 2,
                          },
                          {
                              field: valueTypeB1Ref.current,
                              order: 3,
                          },
                      ]
                    : (operationType === MathOperationType.Multiply || operationType === MathOperationType.Divide) &&
                        valueTypeA === ValueType.Vector3
                      ? [
                            {
                                field: valueTypeARef.current,
                                order: 1,
                            },
                            {
                                field: operationTypeRef.current,
                                order: 2,
                            },
                            {
                                field: valueTypeB2Ref.current,
                                order: 3,
                            },
                        ]
                      : [
                            {
                                field: valueTypeARef.current,
                                order: 1,
                            },
                            {
                                field: operationTypeRef.current,
                                order: 2,
                            },
                        ]
            }
            Outputs={
                valueTypeA === ValueType.Vector2
                    ? [
                          {
                              order: 1,
                              valueType: ValueType.Vector2,
                              valueName: "Vec2",
                              fn: (particleData) => (data.node as VectorMathAPI).Calculate(particleData) as Vector2,
                              label: "Vec2",
                          },
                          {
                              order: 2,
                              valueType: ValueType.Number,
                              valueName: "X",
                              fn: (particleData) => ((data.node as VectorMathAPI).Calculate(particleData) as Vector2).X,
                              label: "X",
                          },
                          {
                              order: 3,
                              valueType: ValueType.Number,
                              valueName: "Y",
                              fn: (particleData) => ((data.node as VectorMathAPI).Calculate(particleData) as Vector2).Y,
                              label: "Y",
                          },
                      ]
                    : [
                          {
                              order: 1,
                              valueType: ValueType.Vector3,
                              valueName: "Vec3",
                              fn: (particleData) => (data.node as VectorMathAPI).Calculate(particleData) as Vector3,
                              label: "Vec3",
                          },
                          {
                              order: 2,
                              valueType: ValueType.Number,
                              valueName: "X",
                              fn: (particleData) => ((data.node as VectorMathAPI).Calculate(particleData) as Vector3).X,
                              label: "X",
                          },
                          {
                              order: 3,
                              valueType: ValueType.Number,
                              valueName: "Y",
                              fn: (particleData) => ((data.node as VectorMathAPI).Calculate(particleData) as Vector3).Y,
                              label: "Y",
                          },
                          {
                              order: 4,
                              valueType: ValueType.Number,
                              valueName: "Z",
                              fn: (particleData) => ((data.node as VectorMathAPI).Calculate(particleData) as Vector3).Z,
                              label: "Z",
                          },
                      ]
            }
        >
            {valueTypeA === ValueType.Vector2 && (
                <ConnectableVector2Field
                    NodeId={data.node.id}
                    NodeField={(data.node as VectorMathAPI).nodeFields.vector2A}
                    NodeFieldName={"vector2A"}
                    Label={"A"}
                />
            )}
            {valueTypeA === ValueType.Vector3 && (
                <ConnectableVector3Field
                    NodeId={data.node.id}
                    NodeField={(data.node as VectorMathAPI).nodeFields.vector3A}
                    NodeFieldName={"vector3A"}
                    Label={"A"}
                />
            )}

            {((valueTypeA === ValueType.Vector2 && valueTypeB1 === ValueType.Number) ||
                (valueTypeA === ValueType.Vector3 && valueTypeB2 === ValueType.Number)) && (
                <ConnectableNumberField
                    NodeId={data.node.id}
                    NodeField={(data.node as VectorMathAPI).nodeFields.numberB}
                    NodeFieldName={"numberB"}
                    Label={"B"}
                    AllowNegative={true}
                />
            )}
            {valueTypeA === ValueType.Vector2 && valueTypeB1 === ValueType.Vector2 && (
                <ConnectableVector2Field
                    NodeId={data.node.id}
                    NodeField={(data.node as VectorMathAPI).nodeFields.vector2B}
                    NodeFieldName={"vector2B"}
                    Label={"B"}
                />
            )}
            {valueTypeA === ValueType.Vector3 && valueTypeB2 === ValueType.Vector3 && (
                <ConnectableVector3Field
                    NodeId={data.node.id}
                    NodeField={(data.node as VectorMathAPI).nodeFields.vector3B}
                    NodeFieldName={"vector3B"}
                    Label={"B"}
                />
            )}
        </Node>
    );
}
