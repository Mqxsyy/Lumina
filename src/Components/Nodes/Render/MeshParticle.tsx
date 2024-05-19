import React from "@rbxts/react";
import { MeshParticle as MeshParticleAPI } from "API/Nodes/Render/MeshParticle";
import { BasicTextLabel } from "Components/Basic/BasicTextLabel";
import Div from "Components/Div";
import NumberField from "Components/NodeFields/NumberField";
import { Vector2Field } from "Components/NodeFields/Vector2Field";
import { AddNode, NodeData } from "Services/NodesService";
import { GetZoomScale } from "ZoomScale";
import Node from "../Node";

export function CreateMeshParticle() {
    return AddNode(new MeshParticleAPI(), (data: NodeData) => {
        return <MeshParticle key={data.order === -1 ? `node_${data.node.id}` : `node_${data.order}_${data.node.id}`} data={data} />;
    });
}

function MeshParticle({ data }: { data: NodeData }) {
    const zoomScale = GetZoomScale();

    return (
        <Node
            Name="Mesh Particle"
            NodeId={data.node.id}
            NodeAnchorPoint={data.anchorPoint}
            IsConnectedToSystem={data.node.connectedSystemId !== undefined}
        >
            <NumberField
                NodeId={data.node.id}
                NodeField={(data.node as MeshParticleAPI).nodeFields.meshId}
                Label={"Mesh Id"}
                AllowNegative={false}
            />
            <NumberField
                NodeId={data.node.id}
                NodeField={(data.node as MeshParticleAPI).nodeFields.textureId}
                Label={"Texture Id"}
                AllowNegative={false}
            />
            <Div Size={UDim2.fromScale(1, 0)} AutomaticSize="Y">
                <uilistlayout Padding={new UDim(0, 5 * zoomScale)} />

                <BasicTextLabel Size={new UDim2(1, 0, 0, 20)} Text={"Sprite Sheet"} />
                <Div Size={UDim2.fromScale(1, 0)} AutomaticSize="Y">
                    <uilistlayout Padding={new UDim(0, 5 * zoomScale)} />
                    <uipadding PaddingLeft={new UDim(0, 10 * zoomScale)} />

                    <Vector2Field
                        NodeId={data.node.id}
                        NodeField={(data.node as MeshParticleAPI).nodeFields.textureSize}
                        ValueLabels={["Width", "Height"]}
                        AllowNegatives={[false, false]}
                    />
                    <NumberField
                        NodeId={data.node.id}
                        NodeField={(data.node as MeshParticleAPI).nodeFields.spriteSheetRows}
                        Label={"Rows"}
                        AllowNegative={false}
                    />
                    <NumberField
                        NodeId={data.node.id}
                        NodeField={(data.node as MeshParticleAPI).nodeFields.spriteSheetColumns}
                        Label={"Columns"}
                        AllowNegative={false}
                    />
                    <NumberField
                        NodeId={data.node.id}
                        NodeField={(data.node as MeshParticleAPI).nodeFields.spriteSheetFrameCount}
                        Label={"Frame Count"}
                        AllowNegative={false}
                    />
                </Div>
            </Div>
        </Node>
    );
}
