import React, { useEffect, useRef, useState } from "@rbxts/react";
import { CapitalizeFirstLetter } from "API/Lib";
import { CalculationType } from "API/Nodes/FieldStates";
import { SetLifetime as SetLifetimeAPI, SetLifetimeFieldNames } from "API/Nodes/Initialize/SetLifetime";
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
            setForceRender((prev) => prev + 1);

            task.spawn(() => {
                task.wait();
                setForceRender((prev) => prev + 1);
            });
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
        >
            <StateField NodeField={calculationTypeRef.current} />

            {calculationTypeRef.current.GetState() === CalculationType.Uniform ? (
                <ConnectableNumberField
                    NodeId={data.node.id}
                    NodeField={(data.node as SetLifetimeAPI).nodeFields.time}
                    NodeFieldName={SetLifetimeFieldNames.time}
                    Label={CapitalizeFirstLetter(SetLifetimeFieldNames.time)}
                />
            ) : (
                <ConnectableVector2Field
                    NodeId={data.node.id}
                    NodeField={(data.node as SetLifetimeAPI).nodeFields.range}
                    NodeFieldName={SetLifetimeFieldNames.range}
                    Label={CapitalizeFirstLetter(SetLifetimeFieldNames.range)}
                />
            )}
        </Node>
    );
}
