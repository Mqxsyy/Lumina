import React, { useEffect, useRef, useState } from "@rbxts/react";
import { RangeCount, ValueType } from "API/Nodes/FieldStates";
import { RandomNumber as RandomNumberAPI } from "API/Nodes/Logic/RandomNumber";
import { ConnectableVector2Field } from "Components/NodeFields/ConnectableVector2Field";
import StateField from "Components/NodeFields/StateField";
import { AddNode, type NodeData } from "Services/NodesService";
import Node from "../Node";

export function CreateRandomNumber() {
    return AddNode(new RandomNumberAPI(), (data: NodeData) => {
        return (
            <RandomNumber
                key={data.node.updateOrder === -1 ? `node_${data.node.id}` : `node_${data.node.updateOrder}_${data.node.id}`}
                data={data}
            />
        );
    });
}

function RandomNumber({ data }: { data: NodeData }) {
    const [_, setForceRender] = useState(0);

    const rangeCountFieldRef = useRef((data.node as RandomNumberAPI).nodeFields.rangeCount);
    const rangeCount = rangeCountFieldRef.current.GetState();

    useEffect(() => {
        const connection = rangeCountFieldRef.current.FieldChanged.Connect(() => {
            setForceRender((prev) => prev + 1);
        });

        return () => {
            connection.Disconnect();
        };
    });

    return (
        <Node
            Name="Random Number"
            NodeId={data.node.id}
            NodeAnchorPoint={data.anchorPoint}
            IsConnectedToSystem={data.node.connectedSystemId !== undefined}
            ConnectionValueType={ValueType.Number}
        >
            <StateField NodeField={rangeCountFieldRef.current} />
            <ConnectableVector2Field
                NodeId={data.node.id}
                NodeField={(data.node as RandomNumberAPI).nodeFields.range1}
                NodeFieldName={"range"}
                ValueLabels={["Min", "Max"]}
                Label={rangeCount === RangeCount.SingleRange ? "Range" : "Range 1"}
            />
            {rangeCount === RangeCount.DoubleRange && (
                <ConnectableVector2Field
                    NodeId={data.node.id}
                    NodeField={(data.node as RandomNumberAPI).nodeFields.range2}
                    NodeFieldName={"range"}
                    ValueLabels={["Min", "Max"]}
                    Label="Range 2"
                />
            )}
        </Node>
    );
}
