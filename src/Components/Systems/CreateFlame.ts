import { NodeGroups } from "API/NodeGroup";
import { AxisType, CalculationType } from "API/Nodes/FieldStates";
import type { SetEmission } from "API/Nodes/Initialize/SetEmission";
import type { SetLifetime } from "API/Nodes/Initialize/SetLifetime";
import type { SetPosition } from "API/Nodes/Initialize/SetPosition";
import type { SetRotation } from "API/Nodes/Initialize/SetRotation";
import type { SetSize } from "API/Nodes/Initialize/SetSize";
import type { SetVelocity } from "API/Nodes/Initialize/SetVelocity";
import type { PlaneParticle } from "API/Nodes/Render/PlaneParticle";
import type { ConstantSpawn } from "API/Nodes/Spawn/ConstantSpawn";
import type { AddRotation } from "API/Nodes/Update/AddRotation";
import type { Drag } from "API/Nodes/Update/Drag";
import type { MultiplySizeOverLife } from "API/Nodes/Update/MultiplySizeOverLife";
import type { SetColorOverLife } from "API/Nodes/Update/SetColorOverLife";
import type { SetTransparencyOverLife } from "API/Nodes/Update/SetTransparencyOverLife";
import {
    CreateAddRotation,
    CreateConstantSpawn,
    CreateDrag,
    CreateMultiplySizeOverLife,
    CreatePlaneParticle,
    CreateSetColorOverLife,
    CreateSetEmission,
    CreateSetLifetime,
    CreateSetPosition,
    CreateSetRotation,
    CreateSetSize,
    CreateSetTransparencyOverLife,
    CreateSetVelocity,
} from "Lists/NodeListCreateBarrel";
import { CreateEmptySystem } from "./CreateEmptySystem";

export function CreateFlameSystem() {
    const flameSystem = CreateEmptySystem();
    const flameSystemData = flameSystem.data;
    flameSystemData.systemName = "Flame";
    flameSystemData.anchorPoint = new Vector2(-325, 0);

    flameSystemData.finishedBindingGroups.Connect(() => {
        // spawn
        const constantSpawn = CreateConstantSpawn();
        (constantSpawn.data.node as ConstantSpawn).nodeFields.rate.SetNumber(60);
        constantSpawn.elementLoaded.Connect(() => {
            (flameSystemData.addToNodeGroup[NodeGroups.Spawn] as (id: number) => void)(constantSpawn.data.node.id);
        });

        // init
        const setLifetimeRandom = CreateSetLifetime();
        (setLifetimeRandom.data.node as SetLifetime).nodeFields.calculationType.SetState(CalculationType.Random);
        (setLifetimeRandom.data.node as SetLifetime).nodeFields.range.SetVector2(0.8, 1.2);
        setLifetimeRandom.elementLoaded.Connect(() => {
            (flameSystemData.addToNodeGroup[NodeGroups.Initialize] as (id: number) => void)(setLifetimeRandom.data.node.id);
        });

        const setPosition = CreateSetPosition();
        (setPosition.data.node as SetPosition).nodeFields.position.SetY(5);
        setPosition.elementLoaded.Connect(() => {
            (flameSystemData.addToNodeGroup[NodeGroups.Initialize] as (id: number) => void)(setPosition.data.node.id);
        });

        const setSizeRandom = CreateSetSize();
        (setSizeRandom.data.node as SetSize).nodeFields.calculationType.SetState(CalculationType.RandomConncted);
        (setSizeRandom.data.node as SetSize).nodeFields.range.SetVector2(1, 2);
        setSizeRandom.elementLoaded.Connect(() => {
            (flameSystemData.addToNodeGroup[NodeGroups.Initialize] as (id: number) => void)(setSizeRandom.data.node.id);
        });

        const setEmission = CreateSetEmission();
        (setEmission.data.node as SetEmission).nodeFields.emission.SetNumber(5);
        setEmission.elementLoaded.Connect(() => {
            (flameSystemData.addToNodeGroup[NodeGroups.Initialize] as (id: number) => void)(setEmission.data.node.id);
        });

        const setRotationZRandom = CreateSetRotation();
        (setRotationZRandom.data.node as SetRotation).nodeFields.calculationType.SetState(CalculationType.Random);
        (setRotationZRandom.data.node as SetRotation).nodeFields.axisType.SetState(AxisType.Z);
        (setRotationZRandom.data.node as SetRotation).nodeFields.rangeZ.SetVector2(-360, 360);
        setRotationZRandom.elementLoaded.Connect(() => {
            (flameSystemData.addToNodeGroup[NodeGroups.Initialize] as (id: number) => void)(setRotationZRandom.data.node.id);
        });

        const setVelocityRandom = CreateSetVelocity();
        (setVelocityRandom.data.node as SetVelocity).nodeFields.calculationType.SetState(CalculationType.Random);
        (setVelocityRandom.data.node as SetVelocity).nodeFields.rangeX.SetVector2(-0.5, 0.5);
        (setVelocityRandom.data.node as SetVelocity).nodeFields.rangeY.SetVector2(10, 15);
        (setVelocityRandom.data.node as SetVelocity).nodeFields.rangeZ.SetVector2(-0.5, 0.5);
        setVelocityRandom.elementLoaded.Connect(() => {
            (flameSystemData.addToNodeGroup[NodeGroups.Initialize] as (id: number) => void)(setVelocityRandom.data.node.id);
        });

        // upd
        const setColorOverLife = CreateSetColorOverLife();
        (setColorOverLife.data.node as SetColorOverLife).nodeFields.ramp.startPoint.color.SetHSV(0.15, 0.2, 1);
        (setColorOverLife.data.node as SetColorOverLife).nodeFields.ramp.AddPoint(0.2, new Vector3(0.15, 0.85, 1));
        (setColorOverLife.data.node as SetColorOverLife).nodeFields.ramp.AddPoint(0.45, new Vector3(0.01, 0.9, 1));
        (setColorOverLife.data.node as SetColorOverLife).nodeFields.ramp.AddPoint(0.8, new Vector3(0, 1, 0.1));
        (setColorOverLife.data.node as SetColorOverLife).nodeFields.ramp.endPoint.color.SetHSV(0, 0, 0);
        setColorOverLife.elementLoaded.Connect(() => {
            (flameSystemData.addToNodeGroup[NodeGroups.Update] as (id: number) => void)(setColorOverLife.data.node.id);
        });

        const multiplySizeOverLife = CreateMultiplySizeOverLife();
        (multiplySizeOverLife.data.node as MultiplySizeOverLife).nodeFields.graph.startPoint.value = 0.5;
        (multiplySizeOverLife.data.node as MultiplySizeOverLife).nodeFields.graph.AddPoint(0.05, 1.5);
        (multiplySizeOverLife.data.node as MultiplySizeOverLife).nodeFields.graph.AddPoint(0.15, 2);
        (multiplySizeOverLife.data.node as MultiplySizeOverLife).nodeFields.graph.AddPoint(0.5, 1.5);
        (multiplySizeOverLife.data.node as MultiplySizeOverLife).nodeFields.graph.endPoint.value = 0.25;
        multiplySizeOverLife.elementLoaded.Connect(() => {
            (flameSystemData.addToNodeGroup[NodeGroups.Update] as (id: number) => void)(multiplySizeOverLife.data.node.id);
        });

        const setTransparencyOverLife = CreateSetTransparencyOverLife();
        (setTransparencyOverLife.data.node as SetTransparencyOverLife).nodeFields.graph.startPoint.value = 1;
        (setTransparencyOverLife.data.node as SetTransparencyOverLife).nodeFields.graph.AddPoint(0.05, 0.75);
        (setTransparencyOverLife.data.node as SetTransparencyOverLife).nodeFields.graph.AddPoint(0.2, 0.25);
        (setTransparencyOverLife.data.node as SetTransparencyOverLife).nodeFields.graph.AddPoint(0.5, 0.25);
        (setTransparencyOverLife.data.node as SetTransparencyOverLife).nodeFields.graph.AddPoint(0.85, 0.4);
        (setTransparencyOverLife.data.node as SetTransparencyOverLife).nodeFields.graph.endPoint.value = 1;
        setTransparencyOverLife.elementLoaded.Connect(() => {
            (flameSystemData.addToNodeGroup[NodeGroups.Update] as (id: number) => void)(setTransparencyOverLife.data.node.id);
        });

        const drag = CreateDrag();
        (drag.data.node as Drag).nodeFields.drag.SetNumber(2);
        drag.elementLoaded.Connect(() => {
            (flameSystemData.addToNodeGroup[NodeGroups.Update] as (id: number) => void)(drag.data.node.id);
        });

        const addRotationZRandom = CreateAddRotation();
        (addRotationZRandom.data.node as AddRotation).nodeFields.calculationType.SetState(CalculationType.Random);
        (addRotationZRandom.data.node as AddRotation).nodeFields.axisType.SetState(AxisType.Z);
        (addRotationZRandom.data.node as AddRotation).nodeFields.rangeZ.SetVector2(-360, 360);
        addRotationZRandom.elementLoaded.Connect(() => {
            (flameSystemData.addToNodeGroup[NodeGroups.Update] as (id: number) => void)(addRotationZRandom.data.node.id);
        });

        // rend
        const particlePlane = CreatePlaneParticle();
        (particlePlane.data.node as PlaneParticle).nodeFields.assetId.SetNumber(14151781963);
        (particlePlane.data.node as PlaneParticle).nodeFields.imageSize.SetVector2(1024, 1024);
        (particlePlane.data.node as PlaneParticle).nodeFields.spriteSheetRows.SetNumber(4);
        (particlePlane.data.node as PlaneParticle).nodeFields.spriteSheetColumns.SetNumber(4);
        (particlePlane.data.node as PlaneParticle).nodeFields.spriteSheetFrameCount.SetNumber(16);
        particlePlane.elementLoaded.Connect(() => {
            (flameSystemData.addToNodeGroup[NodeGroups.Render] as (id: number) => void)(particlePlane.data.node.id);
        });
    });

    const smokeSystem = CreateEmptySystem();
    const smokeSystemData = smokeSystem.data;
    smokeSystemData.systemName = "Smoke";
    smokeSystemData.anchorPoint = new Vector2(25, 0);

    smokeSystemData.finishedBindingGroups.Connect(() => {
        // spwn
        const constantSpawn = CreateConstantSpawn();
        (constantSpawn.data.node as ConstantSpawn).nodeFields.rate.SetNumber(20);
        constantSpawn.elementLoaded.Connect(() => {
            (smokeSystemData.addToNodeGroup[NodeGroups.Spawn] as (id: number) => void)(constantSpawn.data.node.id);
        });

        // init
        const setLifetimeRandom = CreateSetLifetime();
        (setLifetimeRandom.data.node as SetLifetime).nodeFields.calculationType.SetState(CalculationType.Random);
        (setLifetimeRandom.data.node as SetLifetime).nodeFields.range.SetVector2(0.75, 1.5);
        setLifetimeRandom.elementLoaded.Connect(() => {
            (smokeSystemData.addToNodeGroup[NodeGroups.Initialize] as (id: number) => void)(setLifetimeRandom.data.node.id);
        });

        const setPosition = CreateSetPosition();
        (setPosition.data.node as SetPosition).nodeFields.position.SetY(5);
        setPosition.elementLoaded.Connect(() => {
            (smokeSystemData.addToNodeGroup[NodeGroups.Initialize] as (id: number) => void)(setPosition.data.node.id);
        });

        const setVelocityRandom = CreateSetVelocity();
        (setVelocityRandom.data.node as SetVelocity).nodeFields.calculationType.SetState(CalculationType.Random);
        (setVelocityRandom.data.node as SetVelocity).nodeFields.rangeX.SetVector2(-0.4, 0.4);
        (setVelocityRandom.data.node as SetVelocity).nodeFields.rangeY.SetVector2(15, 20);
        (setVelocityRandom.data.node as SetVelocity).nodeFields.rangeZ.SetVector2(-0.4, 0.4);
        setVelocityRandom.elementLoaded.Connect(() => {
            (smokeSystemData.addToNodeGroup[NodeGroups.Initialize] as (id: number) => void)(setVelocityRandom.data.node.id);
        });

        const setRotationZRandom = CreateSetRotation();
        (setRotationZRandom.data.node as SetRotation).nodeFields.calculationType.SetState(CalculationType.Random);
        (setRotationZRandom.data.node as SetRotation).nodeFields.axisType.SetState(AxisType.Z);
        (setRotationZRandom.data.node as SetRotation).nodeFields.rangeZ.SetVector2(-360, 360);
        setRotationZRandom.elementLoaded.Connect(() => {
            (smokeSystemData.addToNodeGroup[NodeGroups.Initialize] as (id: number) => void)(setRotationZRandom.data.node.id);
        });

        const setEmission = CreateSetEmission();
        (setEmission.data.node as SetEmission).nodeFields.emission.SetNumber(0);
        setEmission.elementLoaded.Connect(() => {
            (smokeSystemData.addToNodeGroup[NodeGroups.Initialize] as (id: number) => void)(setEmission.data.node.id);
        });

        const setSizeRandom = CreateSetSize();
        (setSizeRandom.data.node as SetSize).nodeFields.calculationType.SetState(CalculationType.RandomConncted);
        (setSizeRandom.data.node as SetSize).nodeFields.range.SetVector2(1, 2);
        setSizeRandom.elementLoaded.Connect(() => {
            (smokeSystemData.addToNodeGroup[NodeGroups.Initialize] as (id: number) => void)(setSizeRandom.data.node.id);
        });

        // upd
        const setTransparencyOverLife = CreateSetTransparencyOverLife();
        (setTransparencyOverLife.data.node as SetTransparencyOverLife).nodeFields.graph.startPoint.value = 1;
        (setTransparencyOverLife.data.node as SetTransparencyOverLife).nodeFields.graph.AddPoint(0.1, 1);
        (setTransparencyOverLife.data.node as SetTransparencyOverLife).nodeFields.graph.AddPoint(0.4, 0.8);
        (setTransparencyOverLife.data.node as SetTransparencyOverLife).nodeFields.graph.AddPoint(0.75, 0.85);
        (setTransparencyOverLife.data.node as SetTransparencyOverLife).nodeFields.graph.endPoint.value = 1;
        setTransparencyOverLife.elementLoaded.Connect(() => {
            (smokeSystemData.addToNodeGroup[NodeGroups.Update] as (id: number) => void)(setTransparencyOverLife.data.node.id);
        });

        const drag = CreateDrag();
        (drag.data.node as Drag).nodeFields.drag.SetNumber(2.5);
        drag.elementLoaded.Connect(() => {
            (smokeSystemData.addToNodeGroup[NodeGroups.Update] as (id: number) => void)(drag.data.node.id);
        });

        const multiplySizeOverLife = CreateMultiplySizeOverLife();
        (multiplySizeOverLife.data.node as MultiplySizeOverLife).nodeFields.graph.startPoint.value = 0;
        (multiplySizeOverLife.data.node as MultiplySizeOverLife).nodeFields.graph.AddPoint(0.2, 2);
        (multiplySizeOverLife.data.node as MultiplySizeOverLife).nodeFields.graph.AddPoint(0.4, 2);
        (multiplySizeOverLife.data.node as MultiplySizeOverLife).nodeFields.graph.AddPoint(0.6, 1);
        (multiplySizeOverLife.data.node as MultiplySizeOverLife).nodeFields.graph.endPoint.value = 0.5;
        multiplySizeOverLife.elementLoaded.Connect(() => {
            (smokeSystemData.addToNodeGroup[NodeGroups.Update] as (id: number) => void)(multiplySizeOverLife.data.node.id);
        });

        const addRotationZRandom = CreateAddRotation();
        (addRotationZRandom.data.node as AddRotation).nodeFields.calculationType.SetState(CalculationType.Random);
        (addRotationZRandom.data.node as AddRotation).nodeFields.axisType.SetState(AxisType.Z);
        (addRotationZRandom.data.node as AddRotation).nodeFields.rangeZ.SetVector2(-180, 180);
        addRotationZRandom.elementLoaded.Connect(() => {
            (smokeSystemData.addToNodeGroup[NodeGroups.Update] as (id: number) => void)(addRotationZRandom.data.node.id);
        });

        //rend
        const particlePlane = CreatePlaneParticle();
        (particlePlane.data.node as PlaneParticle).nodeFields.assetId.SetNumber(14151754389);
        (particlePlane.data.node as PlaneParticle).nodeFields.imageSize.SetVector2(1024, 1024);
        (particlePlane.data.node as PlaneParticle).nodeFields.spriteSheetRows.SetNumber(4);
        (particlePlane.data.node as PlaneParticle).nodeFields.spriteSheetColumns.SetNumber(4);
        (particlePlane.data.node as PlaneParticle).nodeFields.spriteSheetFrameCount.SetNumber(16);
        particlePlane.elementLoaded.Connect(() => {
            (smokeSystemData.addToNodeGroup[NodeGroups.Render] as (id: number) => void)(particlePlane.data.node.id);
        });
    });

    return [flameSystem, smokeSystem];
}
