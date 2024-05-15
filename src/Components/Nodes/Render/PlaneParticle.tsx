import React from "@rbxts/react";
import { CapitalizeFirstLetter } from "API/Lib";
import { PlaneParticle as PlaneParticleAPI, PlaneParticleFieldNames } from "API/Nodes/Render/PlaneParticle";
import { BasicTextLabel } from "Components/Basic/BasicTextLabel";
import Div from "Components/Div";
import NumberField from "Components/NodeFields/NumberField";
import { Vector2Field } from "Components/NodeFields/Vector2Field";
import { AddNode, NodeData } from "Services/NodesService";
import { GetZoomScale } from "ZoomScale";
import Node from "../Node";
import OrientationField from "Components/NodeFields/OrientationField";
import BooleanField from "Components/NodeFields/BooleanField";

export function CreatePlaneParticle() {
    return AddNode(new PlaneParticleAPI(), (data: NodeData) => {
        return <PlaneParticle key={`node_${data.node.id}`} data={data} />;
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
            <OrientationField
                NodeField={(data.node as PlaneParticleAPI).nodeFields.orientation}
                Label={"Orientation"}
            />
            <NumberField
                NodeId={data.node.id}
                NodeField={(data.node as PlaneParticleAPI).nodeFields.assetId}
                NodeFieldName={PlaneParticleFieldNames.assetId}
                Label={CapitalizeFirstLetter(PlaneParticleFieldNames.assetId)}
                AllowNegative={false}
                AllowConnection={false}
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
                        NodeFieldName={PlaneParticleFieldNames.imageSize}
                        ValueLabels={["Width", "Height"]}
                        AllowNegatives={[false, false]}
                        AllowConnections={[false, false]}
                    />
                    <NumberField
                        NodeId={data.node.id}
                        NodeField={(data.node as PlaneParticleAPI).nodeFields.spriteSheetRows}
                        NodeFieldName={PlaneParticleFieldNames.spriteSheetRows}
                        Label={"Rows"}
                        AllowNegative={false}
                        AllowConnection={false}
                    />
                    <NumberField
                        NodeId={data.node.id}
                        NodeField={(data.node as PlaneParticleAPI).nodeFields.spriteSheetColumns}
                        NodeFieldName={PlaneParticleFieldNames.spriteSheetColumns}
                        Label={"Columns"}
                        AllowNegative={false}
                        AllowConnection={false}
                    />
                    <NumberField
                        NodeId={data.node.id}
                        NodeField={(data.node as PlaneParticleAPI).nodeFields.spriteSheetFrameCount}
                        NodeFieldName={PlaneParticleFieldNames.spriteSheetFrameCount}
                        Label={"Frame Count"}
                        AllowNegative={false}
                        AllowConnection={false}
                    />
                </Div>
            </Div>
        </Node>
    );
}
