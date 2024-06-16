import React, { useEffect, useState } from "@rbxts/react";
import { CalculationType2 } from "API/Nodes/FieldStates";
import { MultiplyRotationOverLife as MultiplyRotationOverLifeAPI } from "API/Nodes/Update/MultiplyRotationOverLife";
import { LineGraphField } from "Components/NodeFields/LineGraphField";
import StateField from "Components/NodeFields/StateField";
import { AddNode, type NodeData } from "Services/NodesService";
import Node from "../Node";

export function CreateMultiplyRotationOverLife() {
    return AddNode(new MultiplyRotationOverLifeAPI(), (data: NodeData) => {
        return (
            <MultiplyRotationOverLife
                key={data.node.updateOrder === -1 ? `node_${data.node.id}` : `node_${data.node.updateOrder}_${data.node.id}`}
                data={data}
            />
        );
    });
}

function MultiplyRotationOverLife({ data }: { data: NodeData }) {
    const [_, setForceRender] = useState(0);
    const calculationType = (data.node as MultiplyRotationOverLifeAPI).nodeFields.calculationType.GetState();

    useEffect(() => {
        const connection = (data.node as MultiplyRotationOverLifeAPI).nodeFields.calculationType.FieldChanged.Connect(() => {
            setForceRender((prev) => prev + 1);
        });

        return () => {
            connection.Disconnect();
        };
    });

    return (
        <Node
            Name="Multiple Rotation Over Life"
            NodeId={data.node.id}
            NodeAnchorPoint={data.anchorPoint}
            IsConnectedToSystem={data.node.connectedSystemId !== undefined}
            Types={[
                {
                    field: (data.node as MultiplyRotationOverLifeAPI).nodeFields.calculationType,
                    order: 1,
                },
            ]}
        >
            {calculationType === CalculationType2.Connected && (
                <LineGraphField
                    Label={"Graph"}
                    Graph={(data.node as MultiplyRotationOverLifeAPI).nodeFields.graph}
                    MaxValue={5}
                    MinValue={-5}
                />
            )}
            {calculationType === CalculationType2.Individual && (
                <>
                    <LineGraphField
                        Label={"Graph X"}
                        Graph={(data.node as MultiplyRotationOverLifeAPI).nodeFields.graphX}
                        MaxValue={5}
                        MinValue={-5}
                    />
                    <LineGraphField
                        Label={"Graph Y"}
                        Graph={(data.node as MultiplyRotationOverLifeAPI).nodeFields.graphY}
                        MaxValue={5}
                        MinValue={-5}
                    />
                    <LineGraphField
                        Label={"Graph Z"}
                        Graph={(data.node as MultiplyRotationOverLifeAPI).nodeFields.graphZ}
                        MaxValue={5}
                        MinValue={-5}
                    />
                </>
            )}
        </Node>
    );
}
