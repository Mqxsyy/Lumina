import React, { useEffect, useState } from "@rbxts/react";
import { CapitalizeFirstLetter } from "API/Lib";
import { MoveTowards as MoveTowardsAPI, MoveTowardsFieldNames } from "API/Nodes/Update/MoveTowards";
import BooleanField from "Components/NodeFields/BooleanField";
import ConnectableNumberField from "Components/NodeFields/ConnectableNumberField";
import { ConnectableVector3Field } from "Components/NodeFields/ConnectableVector3Field";
import { AddNode, type NodeData } from "Services/NodesService";
import Node from "../Node";

export function CreateMoveTowards() {
    return AddNode(new MoveTowardsAPI(), (data: NodeData) => {
        return (
            <MoveTowards
                key={data.node.updateOrder === -1 ? `node_${data.node.id}` : `node_${data.node.updateOrder}_${data.node.id}`}
                data={data}
            />
        );
    });
}

function MoveTowards({ data }: { data: NodeData }) {
    const [_, setForceRender] = useState(0);

    useEffect(() => {
        const connection = (data.node as MoveTowardsAPI).nodeFields.overrideSpeed.FieldChanged.Connect(() => {
            setForceRender((prev) => prev + 1);
        });

        return () => {
            connection.Disconnect();
        };
    });

    return (
        <Node
            Name="Move Towards"
            NodeId={data.node.id}
            NodeAnchorPoint={data.anchorPoint}
            IsConnectedToSystem={data.node.connectedSystemId !== undefined}
        >
            <ConnectableVector3Field
                NodeId={data.node.id}
                NodeField={(data.node as MoveTowardsAPI).nodeFields.target}
                NodeFieldName={"Target Position"}
            />
            <ConnectableNumberField
                NodeId={data.node.id}
                NodeField={(data.node as MoveTowardsAPI).nodeFields.intensity}
                NodeFieldName={MoveTowardsFieldNames.intensity}
                Label={CapitalizeFirstLetter(MoveTowardsFieldNames.intensity)}
            />
            <BooleanField NodeField={(data.node as MoveTowardsAPI).nodeFields.overrideSpeed} Label={"Override Speed"} />

            {(data.node as MoveTowardsAPI).nodeFields.overrideSpeed.GetBoolean() && (
                <ConnectableNumberField
                    NodeId={data.node.id}
                    NodeField={(data.node as MoveTowardsAPI).nodeFields.speed}
                    NodeFieldName={MoveTowardsFieldNames.speed}
                    Label={CapitalizeFirstLetter(MoveTowardsFieldNames.speed)}
                />
            )}
        </Node>
    );
}
