import { NodeGroups } from "API/NodeGroup";
import { SetEmission } from "API/Nodes/Initialize/SetEmission";
import { SetLifetimeRandom } from "API/Nodes/Initialize/SetLifetimeRandom";
import { SetPosition } from "API/Nodes/Initialize/SetPosition";
import { SetRotationZRandom } from "API/Nodes/Initialize/SetRotationZRandom";
import { SetSizeRandom } from "API/Nodes/Initialize/SetSizeRandom";
import { SetVelocityRandom } from "API/Nodes/Initialize/SetVelocityRandom";
import { ParticlePlane } from "API/Nodes/Render/ParticlePlane";
import { ConstantSpawn } from "API/Nodes/Spawn/ConstantSpawn";
import { AddRotationZRandom } from "API/Nodes/Update/AddRotationZRandom";
import { Drag } from "API/Nodes/Update/Drag";
import { MultiplySizeOverLife } from "API/Nodes/Update/MultiplySizeOverLife";
import { SetColorOverLife } from "API/Nodes/Update/SetColorOverLife";
import { SetTransparencyOverLife } from "API/Nodes/Update/SetTransparencyOverLife";
import { CreateSetPosition } from "Components/Nodes/Initialize/SetPosition";
import { CreateSetRotationZRandom } from "Components/Nodes/Initialize/SetRotationZRandom";
import { CreateParticlePlane } from "Components/Nodes/Render/ParticlePlane";
import { CreateConstantSpawn } from "Components/Nodes/Spawn/ConstantSpawn";
import {
    CreateAddRotationZRandom,
    CreateDrag,
    CreateMultiplySizeOverLife,
    CreateSetColorOverLife,
    CreateSetEmission,
    CreateSetLifetimeRandom,
    CreateSetSizeRandom,
    CreateSetTransparencyOverLife,
    CreateSetVelocityRandom,
} from "Lists/NodesListNodeBarrel";
import { CreateEmptySystem } from "./CreateEmptySystem";

export function CreateFlameSystem() {
    const flameSystem = CreateEmptySystem();
    const flameSystemData = flameSystem.data;

    flameSystemData.anchorPoint = new Vector2(-325, 0);
    flameSystemData.finishedBindingGroups.Connect(() => {
        // spawn
        const constantSpawn = CreateConstantSpawn();
        (constantSpawn.data.node as ConstantSpawn).nodeFields.rate.SetNumber(60);
        constantSpawn.elementLoaded.Connect(() => {
            flameSystemData.addToNodeGroup[NodeGroups.Spawn]!(constantSpawn.data.node.id);
        });

        // init
        const setLifetimeRandom = CreateSetLifetimeRandom();
        (setLifetimeRandom.data.node as SetLifetimeRandom).nodeFields.range.SetVector2(0.8, 1.2);
        setLifetimeRandom.elementLoaded.Connect(() => {
            flameSystemData.addToNodeGroup[NodeGroups.Initialize]!(setLifetimeRandom.data.node.id);
        });

        const setPosition = CreateSetPosition();
        (setPosition.data.node as SetPosition).nodeFields.position.SetY(5);
        setPosition.elementLoaded.Connect(() => {
            flameSystemData.addToNodeGroup[NodeGroups.Initialize]!(setPosition.data.node.id);
        });

        const setSizeRandom = CreateSetSizeRandom();
        (setSizeRandom.data.node as SetSizeRandom).nodeFields.range.SetVector2(1, 2);
        setSizeRandom.elementLoaded.Connect(() => {
            flameSystemData.addToNodeGroup[NodeGroups.Initialize]!(setSizeRandom.data.node.id);
        });

        const setEmission = CreateSetEmission();
        (setEmission.data.node as SetEmission).nodeFields.emission.SetNumber(5);
        setEmission.elementLoaded.Connect(() => {
            flameSystemData.addToNodeGroup[NodeGroups.Initialize]!(setEmission.data.node.id);
        });

        const setRotationZRandom = CreateSetRotationZRandom();
        (setRotationZRandom.data.node as SetRotationZRandom).nodeFields.range.SetVector2(-360, 360);
        setRotationZRandom.elementLoaded.Connect(() => {
            flameSystemData.addToNodeGroup[NodeGroups.Initialize]!(setRotationZRandom.data.node.id);
        });

        const setVelocityRandom = CreateSetVelocityRandom();
        (setVelocityRandom.data.node as SetVelocityRandom).nodeFields.rangeX.SetVector2(-0.5, 0.5);
        (setVelocityRandom.data.node as SetVelocityRandom).nodeFields.rangeY.SetVector2(10, 15);
        (setVelocityRandom.data.node as SetVelocityRandom).nodeFields.rangeZ.SetVector2(-0.5, 0.5);
        setVelocityRandom.elementLoaded.Connect(() => {
            flameSystemData.addToNodeGroup[NodeGroups.Initialize]!(setVelocityRandom.data.node.id);
        });

        // upd
        const setColorOverLife = CreateSetColorOverLife();
        (setColorOverLife.data.node as SetColorOverLife).nodeFields.ramp.startPoint.color.SetHSV(0.15, 0.2, 1);
        (setColorOverLife.data.node as SetColorOverLife).nodeFields.ramp.AddPoint(0.2, new Vector3(0.15, 0.85, 1));
        (setColorOverLife.data.node as SetColorOverLife).nodeFields.ramp.AddPoint(0.45, new Vector3(0.01, 0.9, 1));
        (setColorOverLife.data.node as SetColorOverLife).nodeFields.ramp.AddPoint(0.8, new Vector3(0, 1, 0.1));
        (setColorOverLife.data.node as SetColorOverLife).nodeFields.ramp.endPoint.color.SetHSV(0, 0, 0);
        setColorOverLife.elementLoaded.Connect(() => {
            flameSystemData.addToNodeGroup[NodeGroups.Update]!(setColorOverLife.data.node.id);
        });

        const multiplySizeOverLife = CreateMultiplySizeOverLife();
        (multiplySizeOverLife.data.node as MultiplySizeOverLife).nodeFields.graph.startPoint.value = 0.5;
        (multiplySizeOverLife.data.node as MultiplySizeOverLife).nodeFields.graph.AddPoint(0.05, 1.5);
        (multiplySizeOverLife.data.node as MultiplySizeOverLife).nodeFields.graph.AddPoint(0.15, 2);
        (multiplySizeOverLife.data.node as MultiplySizeOverLife).nodeFields.graph.AddPoint(0.5, 1.5);
        (multiplySizeOverLife.data.node as MultiplySizeOverLife).nodeFields.graph.endPoint.value = 0.25;
        multiplySizeOverLife.elementLoaded.Connect(() => {
            flameSystemData.addToNodeGroup[NodeGroups.Update]!(multiplySizeOverLife.data.node.id);
        });

        const setTransparencyOverLife = CreateSetTransparencyOverLife();
        (setTransparencyOverLife.data.node as SetTransparencyOverLife).nodeFields.graph.startPoint.value = 1;
        (setTransparencyOverLife.data.node as SetTransparencyOverLife).nodeFields.graph.AddPoint(0.05, 0.75);
        (setTransparencyOverLife.data.node as SetTransparencyOverLife).nodeFields.graph.AddPoint(0.2, 0.25);
        (setTransparencyOverLife.data.node as SetTransparencyOverLife).nodeFields.graph.AddPoint(0.5, 0.25);
        (setTransparencyOverLife.data.node as SetTransparencyOverLife).nodeFields.graph.AddPoint(0.85, 0.4);
        (setTransparencyOverLife.data.node as SetTransparencyOverLife).nodeFields.graph.endPoint.value = 1;
        setTransparencyOverLife.elementLoaded.Connect(() => {
            flameSystemData.addToNodeGroup[NodeGroups.Update]!(setTransparencyOverLife.data.node.id);
        });

        const drag = CreateDrag();
        (drag.data.node as Drag).nodeFields.drag.SetNumber(2);
        drag.elementLoaded.Connect(() => {
            flameSystemData.addToNodeGroup[NodeGroups.Update]!(drag.data.node.id);
        });

        const addRotationZRandom = CreateAddRotationZRandom();
        (addRotationZRandom.data.node as AddRotationZRandom).nodeFields.range.SetVector2(-360, 360);
        addRotationZRandom.elementLoaded.Connect(() => {
            flameSystemData.addToNodeGroup[NodeGroups.Update]!(addRotationZRandom.data.node.id);
        });

        // rend
        const particlePlane = CreateParticlePlane();
        (particlePlane.data.node as ParticlePlane).nodeFields.assetId.SetNumber(14151781963);
        (particlePlane.data.node as ParticlePlane).nodeFields.imageSize.SetVector2(1024, 1024);
        (particlePlane.data.node as ParticlePlane).nodeFields.spriteSheetRows.SetNumber(4);
        (particlePlane.data.node as ParticlePlane).nodeFields.spriteSheetColumns.SetNumber(4);
        (particlePlane.data.node as ParticlePlane).nodeFields.spriteSheetFrameCount.SetNumber(16);
        particlePlane.elementLoaded.Connect(() => {
            flameSystemData.addToNodeGroup[NodeGroups.Render]!(particlePlane.data.node.id);
        });
    });

    const smokeSystem = CreateEmptySystem();
    const smokeSystemData = smokeSystem.data;
    smokeSystemData.anchorPoint = new Vector2(25, 0);
    smokeSystemData.finishedBindingGroups.Connect(() => {
        // spwn
        const constantSpawn = CreateConstantSpawn();
        (constantSpawn.data.node as ConstantSpawn).nodeFields.rate.SetNumber(20);
        constantSpawn.elementLoaded.Connect(() => {
            smokeSystemData.addToNodeGroup[NodeGroups.Spawn]!(constantSpawn.data.node.id);
        });

        // init
        const setLifetimeRandom = CreateSetLifetimeRandom();
        (setLifetimeRandom.data.node as SetLifetimeRandom).nodeFields.range.SetVector2(0.75, 1.5);
        setLifetimeRandom.elementLoaded.Connect(() => {
            smokeSystemData.addToNodeGroup[NodeGroups.Initialize]!(setLifetimeRandom.data.node.id);
        });

        const setPosition = CreateSetPosition();
        (setPosition.data.node as SetPosition).nodeFields.position.SetY(5);
        setPosition.elementLoaded.Connect(() => {
            smokeSystemData.addToNodeGroup[NodeGroups.Initialize]!(setPosition.data.node.id);
        });

        const setVelocityRandom = CreateSetVelocityRandom();
        (setVelocityRandom.data.node as SetVelocityRandom).nodeFields.rangeX.SetVector2(-0.4, 0.4);
        (setVelocityRandom.data.node as SetVelocityRandom).nodeFields.rangeY.SetVector2(15, 20);
        (setVelocityRandom.data.node as SetVelocityRandom).nodeFields.rangeZ.SetVector2(-0.4, 0.4);
        setVelocityRandom.elementLoaded.Connect(() => {
            smokeSystemData.addToNodeGroup[NodeGroups.Initialize]!(setVelocityRandom.data.node.id);
        });

        const setRotationZRandom = CreateSetRotationZRandom();
        (setRotationZRandom.data.node as SetRotationZRandom).nodeFields.range.SetVector2(-360, 360);
        setRotationZRandom.elementLoaded.Connect(() => {
            smokeSystemData.addToNodeGroup[NodeGroups.Initialize]!(setRotationZRandom.data.node.id);
        });

        const setEmission = CreateSetEmission();
        (setEmission.data.node as SetEmission).nodeFields.emission.SetNumber(0);
        setEmission.elementLoaded.Connect(() => {
            smokeSystemData.addToNodeGroup[NodeGroups.Initialize]!(setEmission.data.node.id);
        });

        const setSizeRandom = CreateSetSizeRandom();
        (setSizeRandom.data.node as SetSizeRandom).nodeFields.range.SetVector2(1, 2);
        setSizeRandom.elementLoaded.Connect(() => {
            smokeSystemData.addToNodeGroup[NodeGroups.Initialize]!(setSizeRandom.data.node.id);
        });

        // upd
        const setTransparencyOverLife = CreateSetTransparencyOverLife();
        (setTransparencyOverLife.data.node as SetTransparencyOverLife).nodeFields.graph.startPoint.value = 1;
        (setTransparencyOverLife.data.node as SetTransparencyOverLife).nodeFields.graph.AddPoint(0.1, 1);
        (setTransparencyOverLife.data.node as SetTransparencyOverLife).nodeFields.graph.AddPoint(0.4, 0.8);
        (setTransparencyOverLife.data.node as SetTransparencyOverLife).nodeFields.graph.AddPoint(0.75, 0.85);
        (setTransparencyOverLife.data.node as SetTransparencyOverLife).nodeFields.graph.endPoint.value = 1;
        setTransparencyOverLife.elementLoaded.Connect(() => {
            smokeSystemData.addToNodeGroup[NodeGroups.Update]!(setTransparencyOverLife.data.node.id);
        });

        const drag = CreateDrag();
        (drag.data.node as Drag).nodeFields.drag.SetNumber(2.5);
        drag.elementLoaded.Connect(() => {
            smokeSystemData.addToNodeGroup[NodeGroups.Update]!(drag.data.node.id);
        });

        const multiplySizeOverLife = CreateMultiplySizeOverLife();
        (multiplySizeOverLife.data.node as MultiplySizeOverLife).nodeFields.graph.startPoint.value = 0;
        (multiplySizeOverLife.data.node as MultiplySizeOverLife).nodeFields.graph.AddPoint(0.2, 2);
        (multiplySizeOverLife.data.node as MultiplySizeOverLife).nodeFields.graph.AddPoint(0.4, 2);
        (multiplySizeOverLife.data.node as MultiplySizeOverLife).nodeFields.graph.AddPoint(0.6, 1);
        (multiplySizeOverLife.data.node as MultiplySizeOverLife).nodeFields.graph.endPoint.value = 0.5;
        multiplySizeOverLife.elementLoaded.Connect(() => {
            smokeSystemData.addToNodeGroup[NodeGroups.Update]!(multiplySizeOverLife.data.node.id);
        });

        const addRotationZRandom = CreateAddRotationZRandom();
        (addRotationZRandom.data.node as AddRotationZRandom).nodeFields.range.SetVector2(-180, 180);
        addRotationZRandom.elementLoaded.Connect(() => {
            smokeSystemData.addToNodeGroup[NodeGroups.Update]!(addRotationZRandom.data.node.id);
        });

        //rend
        const particlePlane = CreateParticlePlane();
        (particlePlane.data.node as ParticlePlane).nodeFields.assetId.SetNumber(14151754389);
        (particlePlane.data.node as ParticlePlane).nodeFields.imageSize.SetVector2(1024, 1024);
        (particlePlane.data.node as ParticlePlane).nodeFields.spriteSheetRows.SetNumber(4);
        (particlePlane.data.node as ParticlePlane).nodeFields.spriteSheetColumns.SetNumber(4);
        (particlePlane.data.node as ParticlePlane).nodeFields.spriteSheetFrameCount.SetNumber(16);
        particlePlane.elementLoaded.Connect(() => {
            smokeSystemData.addToNodeGroup[NodeGroups.Render]!(particlePlane.data.node.id);
        });
    });

    return [flameSystem, smokeSystem];
}
