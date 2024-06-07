import React, { useRef } from "@rbxts/react";
import { ValueType } from "API/Nodes/FieldStates";
import { ValueOut as ValueOutAPI } from "API/Nodes/Logic/ValueOut";
import NumberField from "Components/NodeFields/NumberField";
import StateField from "Components/NodeFields/StateField";
import { Vector2Field } from "Components/NodeFields/Vector2Field";
import { Vector3Field } from "Components/NodeFields/Vector3Field";
import { AddNode, type NodeData } from "Services/NodesService";
import Node from "../Node";

export function CreateValueOut() {
    return AddNode(new ValueOutAPI(), (data: NodeData) => {
        return (
            <ValueOut
                key={data.node.updateOrder === -1 ? `node_${data.node.id}` : `node_${data.node.updateOrder}_${data.node.id}`}
                data={data}
            />
        );
    });
}

function ValueOut({ data }: { data: NodeData }) {
    const valueTypeRef = useRef((data.node as ValueOutAPI).nodeFields.valueType);
    const valueType = valueTypeRef.current.GetState();

    return (
        <Node
            Name="Value Out"
            NodeId={data.node.id}
            NodeAnchorPoint={data.anchorPoint}
            IsConnectedToSystem={data.node.connectedSystemId !== undefined}
            ConnectionValueType={valueType}
            Width={150}
        >
            <StateField NodeId={data.node.id} NodeField={valueTypeRef.current} />

            {valueType === ValueType.Number && (
                <NumberField NodeId={data.node.id} NodeField={(data.node as ValueOutAPI).nodeFields.numberIn} AllowNegative={true} />
            )}

            {valueType === ValueType.Vector2 && (
                <Vector2Field NodeId={data.node.id} NodeField={(data.node as ValueOutAPI).nodeFields.vector2In} />
            )}

            {valueType === ValueType.Vector3 && (
                <Vector3Field NodeId={data.node.id} NodeField={(data.node as ValueOutAPI).nodeFields.vector3In} />
            )}
        </Node>
    );
}
