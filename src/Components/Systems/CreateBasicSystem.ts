import { NodeGroups } from "API/NodeGroup";
import { AxisType } from "API/Nodes/FieldStates";
import type { Position } from "API/Nodes/Mixed/Position";
import type { Velocity } from "API/Nodes/Mixed/Velocity";
import { CreatePosition } from "Components/Nodes/Initialize/Position";
import { CreateSetLifetime } from "Components/Nodes/Initialize/SetLifetime";
import { CreateVelocity } from "Components/Nodes/Mixed/Velocity";
import { CreatePlaneParticle } from "Components/Nodes/Render/PlaneParticle";
import { CreateConstantSpawn } from "Components/Nodes/Spawn/ConstantSpawn";
import { CreateEmptySystem } from "./CreateEmptySystem";

export function CreateBasicSystem() {
    const system = CreateEmptySystem();
    const systemData = system.data;
    systemData.systemName = "Basic System";

    systemData.finishedBindingGroups.Connect(() => {
        const constantSpawn = CreateConstantSpawn();
        constantSpawn.elementLoaded.Connect(() => {
            (systemData.addToNodeGroup[NodeGroups.Spawn] as (id: number) => void)(constantSpawn.data.node.id);
        });

        const setLifetime = CreateSetLifetime();
        setLifetime.elementLoaded.Connect(() => {
            (systemData.addToNodeGroup[NodeGroups.Initialize] as (id: number) => void)(setLifetime.data.node.id);
        });

        const position = CreatePosition();
        (position.data.node as Position).nodeFields.position.SetY(5);
        position.elementLoaded.Connect(() => {
            (systemData.addToNodeGroup[NodeGroups.Initialize] as (id: number) => void)(position.data.node.id);
        });

        const velocity = CreateVelocity();
        (velocity.data.node as Velocity).nodeFields.axisType.SetState(AxisType.Y);
        (velocity.data.node as Velocity).nodeFields.velocityY.SetNumber(5);
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
