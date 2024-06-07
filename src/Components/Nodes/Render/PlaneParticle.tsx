import React from "@rbxts/react";
import { CapitalizeFirstLetter } from "API/Lib";
import { PlaneParticle as PlaneParticleAPI } from "API/Nodes/Render/PlaneParticle";
import { BasicTextLabel } from "Components/Basic/BasicTextLabel";
import Div from "Components/Div";
import BooleanField from "Components/NodeFields/BooleanField";
import NumberField from "Components/NodeFields/NumberField";
import StateField from "Components/NodeFields/StateField";
import { Vector2Field } from "Components/NodeFields/Vector2Field";
import { AddNode, type NodeData } from "Services/NodesService";
import { GetZoomScale } from "ZoomScale";
import Node from "../Node";

export function CreatePlaneParticle() {
    return AddNode(new PlaneParticleAPI(), (data: NodeData) => {
        return (
            <PlaneParticle
                key={data.node.updateOrder === -1 ? `node_${data.node.id}` : `node_${data.node.updateOrder}_${data.node.id}`}
                data={data}
            />
        );
    });
}

function PlaneParticle({ data }: { data: NodeData }) {
    const zoomScale = GetZoomScale();

    return (
        <Node
            Name="Plane Particle"
            NodeId={data.node.id}
            NodeAnchorPoint={data.anchorPoint}
            IsConnectedToSystem={data.node.connectedSystemId !== undefined}
        >
            <StateField NodeField={(data.node as PlaneParticleAPI).nodeFields.orientation} Label={"Orientation"} />
            <NumberField
                NodeId={data.node.id}
                NodeField={(data.node as PlaneParticleAPI).nodeFields.assetId}
                Label={"Asset Id"}
                AllowNegative={false}
            />
            <BooleanField NodeField={(data.node as PlaneParticleAPI).nodeFields.doubleSided} Label={"DoubleSided"} />
            <Div Size={UDim2.fromScale(1, 0)} AutomaticSize="Y">
                <uilistlayout Padding={new UDim(0, 5 * zoomScale)} />

                <BasicTextLabel Size={new UDim2(1, 0, 0, 20)} Text={"Sprite Sheet"} />
                <Div Size={UDim2.fromScale(1, 0)} AutomaticSize="Y">
                    <uilistlayout Padding={new UDim(0, 5 * zoomScale)} />
                    <uipadding PaddingLeft={new UDim(0, 10 * zoomScale)} />

                    <Vector2Field
                        NodeId={data.node.id}
                        NodeField={(data.node as PlaneParticleAPI).nodeFields.imageSize}
                        ValueLabels={["Width", "Height"]}
                        AllowNegatives={[false, false]}
                    />
                    <NumberField
                        NodeId={data.node.id}
                        NodeField={(data.node as PlaneParticleAPI).nodeFields.spriteSheetRows}
                        Label={"Rows"}
                        AllowNegative={false}
                    />
                    <NumberField
                        NodeId={data.node.id}
                        NodeField={(data.node as PlaneParticleAPI).nodeFields.spriteSheetColumns}
                        Label={"Columns"}
                        AllowNegative={false}
                    />
                    <NumberField
                        NodeId={data.node.id}
                        NodeField={(data.node as PlaneParticleAPI).nodeFields.spriteSheetFrameCount}
                        Label={"Frame Count"}
                        AllowNegative={false}
                    />
                </Div>
            </Div>
        </Node>
    );
}
