import React, { useEffect, useRef, useState } from "@rbxts/react";
import { ValueType } from "API/Nodes/FieldStates";
import { VectorMath as VectorMathAPI, VectorMathFieldNames } from "API/Nodes/Logic/VectorMath";
import Div from "Components/Div";
import { ConnectableVector2Field } from "Components/NodeFields/ConnectableVector2Field";
import { ConnectableVector3Field } from "Components/NodeFields/ConnectableVector3Field";
import StateField from "Components/NodeFields/StateField";
import { AddNode, type NodeData } from "Services/NodesService";
import { GetZoomScale } from "ZoomScale";
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

    const vectorTypeRef = useRef((data.node as VectorMathAPI).nodeFields.vectorType);
    const operationTypeRef = useRef((data.node as VectorMathAPI).nodeFields.operationType);

    const vectorType = vectorTypeRef.current.GetState();
    const zoomScale = GetZoomScale();

    useEffect(() => {
        const connection = vectorTypeRef.current.FieldChanged.Connect(() => {
            task.wait();
            setForceRender((prev) => prev + 1);
        });

        return () => {
            connection.Disconnect();
        };
    }, []);

    return (
        <Node
            Name="Value Out"
            NodeId={data.node.id}
            NodeAnchorPoint={data.anchorPoint}
            IsConnectedToSystem={data.node.connectedSystemId !== undefined}
            ConnectionValueType={vectorType}
            Width={150}
        >
            <StateField NodeId={data.node.id} NodeField={vectorTypeRef.current} />
            <StateField NodeId={data.node.id} NodeField={operationTypeRef.current} />

            {vectorType === ValueType.Vector2 && (
                <Div Size={UDim2.fromScale(1, 0)} AutomaticSize="Y">
                    <uilistlayout Padding={new UDim(0, 5 * zoomScale)} />

                    <ConnectableVector2Field
                        NodeId={data.node.id}
                        NodeField={(data.node as VectorMathAPI).nodeFields.vector2A}
                        NodeFieldName={VectorMathFieldNames.vector2A}
                        Label={"A"}
                    />
                    <ConnectableVector2Field
                        NodeId={data.node.id}
                        NodeField={(data.node as VectorMathAPI).nodeFields.vector2B}
                        NodeFieldName={VectorMathFieldNames.vector2B}
                        Label={"B"}
                    />
                </Div>
            )}

            {vectorType === ValueType.Vector3 && (
                <Div Size={UDim2.fromScale(1, 0)} AutomaticSize="Y">
                    <uilistlayout Padding={new UDim(0, 5 * zoomScale)} />

                    <ConnectableVector3Field
                        NodeId={data.node.id}
                        NodeField={(data.node as VectorMathAPI).nodeFields.vector3A}
                        NodeFieldName={VectorMathFieldNames.vector3A}
                        Label={"A"}
                    />
                    <ConnectableVector3Field
                        NodeId={data.node.id}
                        NodeField={(data.node as VectorMathAPI).nodeFields.vector3B}
                        NodeFieldName={VectorMathFieldNames.vector3B}
                        Label={"B"}
                    />
                </Div>
            )}
        </Node>
    );
}
