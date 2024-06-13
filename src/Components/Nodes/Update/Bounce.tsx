import React, { useEffect, useState } from "@rbxts/react";
import { Bounce as BounceAPI } from "API/Nodes/Update/Bounce";
import BooleanField from "Components/NodeFields/BooleanField";
import ConnectableNumberField from "Components/NodeFields/ConnectableNumberField";
import { AddNode, type NodeData } from "Services/NodesService";
import Node from "../Node";

export function CreateBounce() {
    return AddNode(new BounceAPI(), (data: NodeData) => {
        return (
            <Bounce
                key={data.node.updateOrder === -1 ? `node_${data.node.id}` : `node_${data.node.updateOrder}_${data.node.id}`}
                data={data}
            />
        );
    });
}

function Bounce({ data }: { data: NodeData }) {
    const [_, setForceRender] = useState(0);

    useEffect(() => {
        const connection = (data.node as BounceAPI).nodeFields.limitBounces.FieldChanged.Connect(() => setForceRender((prev) => prev + 1));
        return () => connection.Disconnect();
    }, []);

    return (
        <Node
            Name="Bounce"
            NodeId={data.node.id}
            NodeAnchorPoint={data.anchorPoint}
            IsConnectedToSystem={data.node.connectedSystemId !== undefined}
        >
            <ConnectableNumberField
                NodeId={data.node.id}
                NodeField={(data.node as BounceAPI).nodeFields.velocityMultiplier}
                NodeFieldName={"velocityMultiplier"}
                Label={"Velocity Multiplier"}
            />
            <BooleanField NodeField={(data.node as BounceAPI).nodeFields.limitBounces} Label={"Limit Bounces"} />
            {(data.node as BounceAPI).nodeFields.limitBounces.GetBoolean() === true && (
                <ConnectableNumberField
                    NodeId={data.node.id}
                    NodeField={(data.node as BounceAPI).nodeFields.maxBounces}
                    NodeFieldName={"maxBounces"}
                    Label={"Max Bounces"}
                />
            )}
        </Node>
    );
}
