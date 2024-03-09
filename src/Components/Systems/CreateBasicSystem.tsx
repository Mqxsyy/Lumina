import { CreateConstantSpawnNode } from "Components/Nodes/Spawn/ConstantSpawn";
import { CreateEmptySystem } from "./CreateEmptySystem";
import { CreateLifetimeNode } from "Components/Nodes/Initialize/Lifetime";
import { CreateParticlePlaneNode } from "Components/Nodes/Render/ParticlePlane";
import { NodeGroups } from "API/NodeGroup";

export function CreateBasicSystem() {
	const systemData = CreateEmptySystem();

	systemData.finishedBindingGroups.Connect(() => {
		const constantSpawnNode = CreateConstantSpawnNode();
		constantSpawnNode.elementLoaded.Connect(() => {
			systemData.addToNodeGroup[NodeGroups.Spawn]!(constantSpawnNode.id);
		});

		const lifetimeNode = CreateLifetimeNode();
		lifetimeNode.elementLoaded.Connect(() => {
			systemData.addToNodeGroup[NodeGroups.Initialize]!(lifetimeNode.id);
		});

		const particlePlaneNode = CreateParticlePlaneNode();
		particlePlaneNode.elementLoaded.Connect(() => {
			systemData.addToNodeGroup[NodeGroups.Render]!(particlePlaneNode.id);
		});
	});
}
