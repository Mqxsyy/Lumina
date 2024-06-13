import { NodeGroups } from "API/NodeGroup";
import { CalculationType1 } from "API/Nodes/FieldStates";
import type { SetLifetime } from "API/Nodes/Initialize/SetLifetime";
import type { Position } from "API/Nodes/Mixed/Position";
import type { Velocity } from "API/Nodes/Mixed/Velocity";
import { CreatePosition } from "Components/Nodes/Initialize/Position";
import { CreateSetLifetime } from "Components/Nodes/Initialize/SetLifetime";
import { CreateVelocity } from "Components/Nodes/Mixed/Velocity";
import { CreatePlaneParticle } from "Components/Nodes/Render/PlaneParticle";
import { CreateBurstSpawn } from "Components/Nodes/Spawn/BurstSpawn";
import { CreateEmptySystem } from "./CreateEmptySystem";

export function CreateBurstSystem() {
    const system = CreateEmptySystem();
    const systemData = system.data;
    systemData.systemName = "Burst System";

    systemData.finishedBindingGroups.Connect(() => {
        const burstSpawn = CreateBurstSpawn();
        burstSpawn.elementLoaded.Connect(() => {
            (systemData.addToNodeGroup[NodeGroups.Spawn] as (id: number) => void)(burstSpawn.data.node.id);
        });

        const setLifetimeRandom = CreateSetLifetime();
        (setLifetimeRandom.data.node as SetLifetime).nodeFields.calculationType.SetState(CalculationType1.Random);
        (setLifetimeRandom.data.node as SetLifetime).nodeFields.range.SetVector2(0.4, 0.8);
        setLifetimeRandom.elementLoaded.Connect(() => {
            (systemData.addToNodeGroup[NodeGroups.Initialize] as (id: number) => void)(setLifetimeRandom.data.node.id);
        });

        const position = CreatePosition();
        (position.data.node as Position).nodeFields.position.SetY(5);
        position.elementLoaded.Connect(() => {
            (systemData.addToNodeGroup[NodeGroups.Initialize] as (id: number) => void)(position.data.node.id);
        });

        const velocity = CreateVelocity();
        (velocity.data.node as Velocity).nodeFields.calculationType.SetState(CalculationType1.Random);
        (velocity.data.node as Velocity).nodeFields.rangeX.SetVector2(-5, 5);
        (velocity.data.node as Velocity).nodeFields.rangeY.SetVector2(-5, 5);
        (velocity.data.node as Velocity).nodeFields.rangeZ.SetVector2(-5, 5);
        velocity.elementLoaded.Connect(() => {
            (systemData.addToNodeGroup[NodeGroups.Initialize] as (id: number) => void)(velocity.data.node.id);
        });

        const particlePlane = CreatePlaneParticle();
        particlePlane.elementLoaded.Connect(() => {
            (systemData.addToNodeGroup[NodeGroups.Render] as (id: number) => void)(particlePlane.data.node.id);
        });
    });

    return system;
}
