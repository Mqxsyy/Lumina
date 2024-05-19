import React from "@rbxts/react";
import { AddRotationXYZRandom as AddRotationXYZRandomAPI, AddRotationXYZRandomFieldNames } from "API/Nodes/Update/AddRotationXYZRandom";
import { ConnectableVector2Field } from "Components/NodeFields/ConnectableVector2Field";
import { AddNode, NodeData } from "Services/NodesService";
import Node from "../Node";

export function CreateAddRotationXYZRandom() {
    return AddNode(new AddRotationXYZRandomAPI(), (data: NodeData) => {
        return <AddRotationXYZRandom key={data.order === -1 ? `node_${data.node.id}` : `node_${data.order}_${data.node.id}`} data={data} />;
    });
}

function AddRotationXYZRandom({ data }: { data: NodeData }) {
    return (
        <Node
            Name="Add Rotation XYZ Random"
            NodeId={data.node.id}
            NodeAnchorPoint={data.anchorPoint}
            IsConnectedToSystem={data.node.connectedSystemId !== undefined}
        >
            <ConnectableVector2Field
                NodeId={data.node.id}
                NodeField={(data.node as AddRotationXYZRandomAPI).nodeFields.rangeX}
                NodeFieldName={AddRotationXYZRandomFieldNames.rangeX}
                ValueLabels={["Min", "Max"]}
                Label={"X"}
            />
            <ConnectableVector2Field
                NodeId={data.node.id}
                NodeField={(data.node as AddRotationXYZRandomAPI).nodeFields.rangeY}
                NodeFieldName={AddRotationXYZRandomFieldNames.rangeY}
                ValueLabels={["Min", "Max"]}
                Label={"Y"}
            />
            <ConnectableVector2Field
                NodeId={data.node.id}
                NodeField={(data.node as AddRotationXYZRandomAPI).nodeFields.rangeZ}
                NodeFieldName={AddRotationXYZRandomFieldNames.rangeZ}
                ValueLabels={["Min", "Max"]}
                Label={"Z"}
            />
        </Node>
    );
}
