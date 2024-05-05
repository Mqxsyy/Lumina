import { NodeGroups } from "API/NodeGroup";
import { SetLifetimeRandom } from "API/Nodes/Initialize/SetLifetimeRandom";
import { SetPosition } from "API/Nodes/Initialize/SetPosition";
import { SetVelocityRandom } from "API/Nodes/Initialize/SetVelocityRandom";
import { CreateSetPosition } from "Components/Nodes/Initialize/SetPosition";
import { CreateParticlePlane } from "Components/Nodes/Render/ParticlePlane";
import { CreateBurstSpawn } from "Components/Nodes/Spawn/BurstSpawn";
import { CreateSetLifetimeRandom, CreateSetVelocityRandom } from "Lists/NodeListCreateBarrel";
import { CreateEmptySystem } from "./CreateEmptySystem";

export function CreateBurstSystem() {
    const system = CreateEmptySystem();
    const systemData = system.data;
    systemData.systemName = "Burst System";

    systemData.finishedBindingGroups.Connect(() => {
        const burstSpawn = CreateBurstSpawn();
        burstSpawn.elementLoaded.Connect(() => {
            systemData.addToNodeGroup[NodeGroups.Spawn]!(burstSpawn.data.node.id);
        });

        const setLifetimeRandom = CreateSetLifetimeRandom();
        (setLifetimeRandom.data.node as SetLifetimeRandom).nodeFields.range.SetVector2(0.4, 0.8);
        setLifetimeRandom.elementLoaded.Connect(() => {
            systemData.addToNodeGroup[NodeGroups.Initialize]!(setLifetimeRandom.data.node.id);
        });

        const positionNode = CreateSetPosition();
        (positionNode.data.node as SetPosition).nodeFields.position.SetY(5);
        positionNode.elementLoaded.Connect(() => {
            systemData.addToNodeGroup[NodeGroups.Initialize]!(positionNode.data.node.id);
        });

        const setVelocityRandom = CreateSetVelocityRandom();
        (setVelocityRandom.data.node as SetVelocityRandom).nodeFields.rangeX.SetVector2(-5, 5);
        (setVelocityRandom.data.node as SetVelocityRandom).nodeFields.rangeY.SetVector2(-5, 5);
        (setVelocityRandom.data.node as SetVelocityRandom).nodeFields.rangeZ.SetVector2(-5, 5);
        setVelocityRandom.elementLoaded.Connect(() => {
            systemData.addToNodeGroup[NodeGroups.Initialize]!(setVelocityRandom.data.node.id);
        });

        const particlePlane = CreateParticlePlane();
        particlePlane.elementLoaded.Connect(() => {
            systemData.addToNodeGroup[NodeGroups.Render]!(particlePlane.data.node.id);
        });
    });

    return system;
}
