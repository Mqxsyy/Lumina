import React, { useRef } from "@rbxts/react";
import { ValueType } from "API/Nodes/FieldStates";
import { ValueOut as ValueOutAPI } from "API/Nodes/Logic/ValueOut";
import NumberField from "Components/NodeFields/NumberField";
import StateField from "Components/NodeFields/StateField";
import { Vector2Field } from "Components/NodeFields/Vector2Field";
import { Vector3Field } from "Components/NodeFields/Vector3Field";
import ConnectableColorField from "Components/NodeFields/ConnectableColorField";
import { AddNode, type NodeData } from "Services/NodesService";
import Node from "../Node";
import { ColorPickerField } from "Components/NodeFields/ColorPickerField";

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

    // Determine outputs based on type
    const outputs =
        valueType === ValueType.Number
            ? [
                  {
                      order: 1,
                      valueType: ValueType.Number,
                      valueName: "Number",
                      fn: () => (data.node as ValueOutAPI).Calculate() as number,
                  },
              ]
            : valueType === ValueType.Vector2
              ? [
                    {
                        order: 1,
                        valueType: ValueType.Vector2,
                        valueName: "Vec2",
                        fn: () => (data.node as ValueOutAPI).Calculate() as Vector2,
                        label: "Vec2",
                    },
                    {
                        order: 2,
                        valueType: ValueType.Number,
                        valueName: "X",
                        fn: () => ((data.node as ValueOutAPI).Calculate() as Vector2).X,
                        label: "X",
                    },
                    {
                        order: 3,
                        valueType: ValueType.Number,
                        valueName: "Y",
                        fn: () => ((data.node as ValueOutAPI).Calculate() as Vector2).Y,
                        label: "Y",
                    },
                ]
              : valueType === ValueType.Vector3
                ? [
                      {
                          order: 1,
                          valueType: ValueType.Vector3,
                          valueName: "Vec3",
                          fn: () => (data.node as ValueOutAPI).Calculate() as Vector3,
                          label: "Vec3",
                      },
                      {
                          order: 2,
                          valueType: ValueType.Number,
                          valueName: "X",
                          fn: () => ((data.node as ValueOutAPI).Calculate() as Vector3).X,
                          label: "X",
                      },
                      {
                          order: 3,
                          valueType: ValueType.Number,
                          valueName: "Y",
                          fn: () => ((data.node as ValueOutAPI).Calculate() as Vector3).Y,
                          label: "Y",
                      },
                      {
                          order: 4,
                          valueType: ValueType.Number,
                          valueName: "Z",
                          fn: () => ((data.node as ValueOutAPI).Calculate() as Vector3).Z,
                          label: "Z",
                      },
                  ]
                : [
                      {
                          order: 1,
                          valueType: ValueType.Color,
                          valueName: "Color",
                          fn: () => (data.node as ValueOutAPI).Calculate() as Color3,
                      },
                  ];

    return (
        <Node
            Name="Value Out"
            NodeId={data.node.id}
            NodeAnchorPoint={data.anchorPoint}
            IsConnectedToSystem={data.node.connectedSystemId !== undefined}
            Width={150}
            Types={[
                {
                    field: valueTypeRef.current,
                    order: 1,
                },
            ]}
            Outputs={outputs}
        >
            {valueType === ValueType.Number && (
                <NumberField NodeId={data.node.id} NodeField={(data.node as ValueOutAPI).nodeFields.numberIn} AllowNegative={true} />
            )}

            {valueType === ValueType.Vector2 && (
                <Vector2Field NodeId={data.node.id} NodeField={(data.node as ValueOutAPI).nodeFields.vector2In} />
            )}

            {valueType === ValueType.Vector3 && (
                <Vector3Field NodeId={data.node.id} NodeField={(data.node as ValueOutAPI).nodeFields.vector3In} />
            )}

            {valueType === ValueType.Color && (
                <ColorPickerField Label="Color" Disabled={false} ColorPicker={(data.node as ValueOutAPI).nodeFields.colorIn} />
            )}
        </Node>
    );
}
