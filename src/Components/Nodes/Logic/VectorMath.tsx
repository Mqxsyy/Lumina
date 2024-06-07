import React, { useEffect, useRef, useState } from "@rbxts/react";
import { MathOperationType, ValueType } from "API/Nodes/FieldStates";
import { VectorMath as VectorMathAPI } from "API/Nodes/Logic/VectorMath";
import ConnectableNumberField from "Components/NodeFields/ConnectableNumberField";
import { ConnectableVector2Field } from "Components/NodeFields/ConnectableVector2Field";
import ConnectableVector3Field from "Components/NodeFields/ConnectableVector3Field";
import StateField from "Components/NodeFields/StateField";
import { AddNode, type NodeData } from "Services/NodesService";
import Node from "../Node";

export function CreateVectorMath() {
    return AddNode(new VectorMathAPI(), (data: NodeData) => {
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
            ConnectionValueType={ValueType.Vector3}
            Width={150}
        >
            <StateField NodeId={data.node.id} NodeField={operationTypeRef.current} />
            <StateField NodeId={data.node.id} NodeField={valueTypeARef.current} />
            {(operationType === MathOperationType.Multiply || operationType === MathOperationType.Divide) &&
                valueTypeA === ValueType.Vector2 && <StateField NodeId={data.node.id} NodeField={valueTypeB1Ref.current} />}
            {(operationType === MathOperationType.Multiply || operationType === MathOperationType.Divide) &&
                valueTypeA === ValueType.Vector3 && <StateField NodeId={data.node.id} NodeField={valueTypeB2Ref.current} />}

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
