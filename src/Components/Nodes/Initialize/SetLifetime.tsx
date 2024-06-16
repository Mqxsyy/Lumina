import React, { useEffect, useRef, useState } from "@rbxts/react";
import { CalculationType1 } from "API/Nodes/FieldStates";
import { SetLifetime as SetLifetimeAPI } from "API/Nodes/Initialize/SetLifetime";
import ConnectableNumberField from "Components/NodeFields/ConnectableNumberField";
import { ConnectableVector2Field } from "Components/NodeFields/ConnectableVector2Field";
import StateField from "Components/NodeFields/StateField";
import { AddNode, type NodeData } from "Services/NodesService";
import Node from "../Node";

export function CreateSetLifetime() {
    return AddNode(new SetLifetimeAPI(), (data: NodeData) => {
        return (
            <SetLifetime
                key={data.node.updateOrder === -1 ? `node_${data.node.id}` : `node_${data.node.updateOrder}_${data.node.id}`}
                data={data}
            />
        );
    });
}

function SetLifetime({ data }: { data: NodeData }) {
    const [_, setForceRender] = useState(0);
    const calculationTypeRef = useRef((data.node as SetLifetimeAPI).nodeFields.calculationType);

    useEffect(() => {
        const connection = calculationTypeRef.current.FieldChanged.Connect(() => {
            task.wait();
            setForceRender((prev) => prev + 1);
        });

        return () => {
            connection.Disconnect();
        };
    }, []);

    return (
        <Node
            Name={"Set Lifetime"}
            NodeId={data.node.id}
            NodeAnchorPoint={data.anchorPoint}
            IsConnectedToSystem={data.node.connectedSystemId !== undefined}
            Types={[
                {
                    field: calculationTypeRef.current,
                    order: 1,
                },
            ]}
        >
            {calculationTypeRef.current.GetState() === CalculationType1.Uniform ? (
                <ConnectableNumberField
                    NodeId={data.node.id}
                    NodeField={(data.node as SetLifetimeAPI).nodeFields.time}
                    NodeFieldName={"time"}
                    Label={"Time"}
                />
            ) : (
                <ConnectableVector2Field
                    NodeId={data.node.id}
                    NodeField={(data.node as SetLifetimeAPI).nodeFields.range}
                    NodeFieldName={"range"}
                    Label="Range"
                    ValueLabels={["Min", "Max"]}
                />
            )}
        </Node>
    );
}
