import { NodeGroups } from "API/NodeGroup";
import { AxisType, CalculationType, NodeOperationType } from "API/Nodes/FieldStates";
import type { SetLifetime } from "API/Nodes/Initialize/SetLifetime";
import type { Position } from "API/Nodes/Mixed/Position";
import type { Rotation } from "API/Nodes/Mixed/Rotation";
import type { SetEmission } from "API/Nodes/Mixed/SetEmission";
import type { SetSize } from "API/Nodes/Mixed/SetSize";
import type { Velocity } from "API/Nodes/Mixed/Velocity";
import type { PlaneParticle } from "API/Nodes/Render/PlaneParticle";
import type { ConstantSpawn } from "API/Nodes/Spawn/ConstantSpawn";
import type { Drag } from "API/Nodes/Update/Drag";
import type { MultiplySizeOverLife } from "API/Nodes/Update/MultiplySizeOverLife";
import type { SetColorOverLife } from "API/Nodes/Update/SetColorOverLife";
import type { SetTransparencyOverLife } from "API/Nodes/Update/SetTransparencyOverLife";
import { CreatePosition } from "Components/Nodes/Initialize/Position";
import { CreateSetLifetime } from "Components/Nodes/Initialize/SetLifetime";
import { CreateRotation } from "Components/Nodes/Mixed/Rotation";
import { CreateSetEmission } from "Components/Nodes/Mixed/SetEmission";
import { CreateSetSize } from "Components/Nodes/Mixed/SetSize";
import { CreateVelocity } from "Components/Nodes/Mixed/Velocity";
import { CreatePlaneParticle } from "Components/Nodes/Render/PlaneParticle";
import { CreateConstantSpawn } from "Components/Nodes/Spawn/ConstantSpawn";
import { CreateDrag } from "Components/Nodes/Update/Drag";
import { CreateMultiplySizeOverLife } from "Components/Nodes/Update/MultiplySizeOverLife";
import { CreateSetColorOverLife } from "Components/Nodes/Update/SetColorOverLife";
import { CreateSetTransparencyOverLife } from "Components/Nodes/Update/SetTransparencyOverLife";
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
        const setLifetime = CreateSetLifetime();
        (setLifetime.data.node as SetLifetime).nodeFields.calculationType.SetState(CalculationType.Random);
        (setLifetime.data.node as SetLifetime).nodeFields.range.SetVector2(0.8, 1.2);
        setLifetime.elementLoaded.Connect(() => {
            (flameSystemData.addToNodeGroup[NodeGroups.Initialize] as (id: number) => void)(setLifetime.data.node.id);
        });

        const position = CreatePosition();
        (position.data.node as Position).nodeFields.position.SetY(5);
        position.elementLoaded.Connect(() => {
            (flameSystemData.addToNodeGroup[NodeGroups.Initialize] as (id: number) => void)(position.data.node.id);
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

        const rotation = CreateRotation();
        (rotation.data.node as Rotation).nodeFields.calculationType.SetState(CalculationType.Random);
        (rotation.data.node as Rotation).nodeFields.axisType.SetState(AxisType.Z);
        (rotation.data.node as Rotation).nodeFields.rangeZ.SetVector2(-360, 360);
        rotation.elementLoaded.Connect(() => {
            (flameSystemData.addToNodeGroup[NodeGroups.Initialize] as (id: number) => void)(rotation.data.node.id);
        });

        const velocity = CreateVelocity();
        (velocity.data.node as Velocity).nodeFields.calculationType.SetState(CalculationType.Random);
        (velocity.data.node as Velocity).nodeFields.rangeX.SetVector2(-0.5, 0.5);
        (velocity.data.node as Velocity).nodeFields.rangeY.SetVector2(10, 15);
        (velocity.data.node as Velocity).nodeFields.rangeZ.SetVector2(-0.5, 0.5);
        velocity.elementLoaded.Connect(() => {
            (flameSystemData.addToNodeGroup[NodeGroups.Initialize] as (id: number) => void)(velocity.data.node.id);
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

        const rotation2 = CreateRotation();
        (rotation2.data.node as Rotation).nodeFields.nodeOperationType.SetState(NodeOperationType.Add);
        (rotation2.data.node as Rotation).nodeFields.calculationType.SetState(CalculationType.Random);
        (rotation2.data.node as Rotation).nodeFields.axisType.SetState(AxisType.Z);
        (rotation2.data.node as Rotation).nodeFields.rangeZ.SetVector2(-360, 360);
        rotation2.elementLoaded.Connect(() => {
            (flameSystemData.addToNodeGroup[NodeGroups.Update] as (id: number) => void)(rotation.data.node.id);
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

        const position = CreatePosition();
        (position.data.node as Position).nodeFields.position.SetY(5);
        position.elementLoaded.Connect(() => {
            (smokeSystemData.addToNodeGroup[NodeGroups.Initialize] as (id: number) => void)(position.data.node.id);
        });

        const velocity = CreateVelocity();
        (velocity.data.node as Velocity).nodeFields.calculationType.SetState(CalculationType.Random);
        (velocity.data.node as Velocity).nodeFields.rangeX.SetVector2(-0.4, 0.4);
        (velocity.data.node as Velocity).nodeFields.rangeY.SetVector2(15, 20);
        (velocity.data.node as Velocity).nodeFields.rangeZ.SetVector2(-0.4, 0.4);
        velocity.elementLoaded.Connect(() => {
            (smokeSystemData.addToNodeGroup[NodeGroups.Initialize] as (id: number) => void)(velocity.data.node.id);
        });

        const rotation = CreateRotation();
        (rotation.data.node as Rotation).nodeFields.calculationType.SetState(CalculationType.Random);
        (rotation.data.node as Rotation).nodeFields.axisType.SetState(AxisType.Z);
        (rotation.data.node as Rotation).nodeFields.rangeZ.SetVector2(-360, 360);
        rotation.elementLoaded.Connect(() => {
            (smokeSystemData.addToNodeGroup[NodeGroups.Initialize] as (id: number) => void)(rotation.data.node.id);
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

        const rotation2 = CreateRotation();
        (rotation2.data.node as Rotation).nodeFields.calculationType.SetState(CalculationType.Random);
        (rotation2.data.node as Rotation).nodeFields.axisType.SetState(AxisType.Z);
        (rotation2.data.node as Rotation).nodeFields.rangeZ.SetVector2(-180, 180);
        rotation2.elementLoaded.Connect(() => {
            (smokeSystemData.addToNodeGroup[NodeGroups.Update] as (id: number) => void)(rotation2.data.node.id);
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
