import { NodeGroups } from "API/NodeGroup";
import { CalculationType } from "API/Nodes/FieldStates";
import type { SetLifetime } from "API/Nodes/Initialize/SetLifetime";
import type { SetPosition } from "API/Nodes/Initialize/SetPosition";
import type { SetVelocity } from "API/Nodes/Initialize/SetVelocity";
import { CreateSetPosition } from "Components/Nodes/Initialize/SetPosition";
import { CreatePlaneParticle } from "Components/Nodes/Render/PlaneParticle";
import { CreateBurstSpawn } from "Components/Nodes/Spawn/BurstSpawn";
import { CreateSetLifetime, CreateSetVelocity } from "Lists/NodeListCreateBarrel";
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
        (setLifetimeRandom.data.node as SetLifetime).nodeFields.calculationType.SetState(CalculationType.Random);
        (setLifetimeRandom.data.node as SetLifetime).nodeFields.range.SetVector2(0.4, 0.8);
        setLifetimeRandom.elementLoaded.Connect(() => {
            (systemData.addToNodeGroup[NodeGroups.Initialize] as (id: number) => void)(setLifetimeRandom.data.node.id);
        });

        const positionNode = CreateSetPosition();
        (positionNode.data.node as SetPosition).nodeFields.position.SetY(5);
        positionNode.elementLoaded.Connect(() => {
            (systemData.addToNodeGroup[NodeGroups.Initialize] as (id: number) => void)(positionNode.data.node.id);
        });

        const setVelocityRandom = CreateSetVelocity();
        (setVelocityRandom.data.node as SetVelocity).nodeFields.calculationType.SetState(CalculationType.Random);
        (setVelocityRandom.data.node as SetVelocity).nodeFields.rangeX.SetVector2(-5, 5);
        (setVelocityRandom.data.node as SetVelocity).nodeFields.rangeY.SetVector2(-5, 5);
        (setVelocityRandom.data.node as SetVelocity).nodeFields.rangeZ.SetVector2(-5, 5);
        setVelocityRandom.elementLoaded.Connect(() => {
            (systemData.addToNodeGroup[NodeGroups.Initialize] as (id: number) => void)(setVelocityRandom.data.node.id);
        });

        const particlePlane = CreatePlaneParticle();
        particlePlane.elementLoaded.Connect(() => {
            (systemData.addToNodeGroup[NodeGroups.Render] as (id: number) => void)(particlePlane.data.node.id);
        });
    });

    return system;
}
