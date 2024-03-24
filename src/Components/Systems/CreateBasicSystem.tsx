import { CreateConstantSpawnNode } from "Components/Nodes/Spawn/ConstantSpawn";
import { CreateEmptySystem } from "./CreateEmptySystem";
import { CreateLifetimeNode } from "Components/Nodes/Initialize/Lifetime";
import { CreateParticlePlaneNode } from "Components/Nodes/Render/ParticlePlane";
import { NodeGroups } from "API/NodeGroup";
import { CreateStaticForceNode } from "Components/Nodes/Update/StaticForce";
import { CreatePositionNode } from "Components/Nodes/Initialize/Position";
import { Position } from "API/Nodes/Initialize/Position";

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

		const positionNode = CreatePositionNode();
		(positionNode.node as Position).nodeFields.position.SetValueY(5);
		positionNode.elementLoaded.Connect(() => {
			systemData.addToNodeGroup[NodeGroups.Initialize]!(positionNode.id);
		});

		const staticForceNode = CreateStaticForceNode();
		staticForceNode.elementLoaded.Connect(() => {
			systemData.addToNodeGroup[NodeGroups.Update]!(staticForceNode.id);
		});

		const particlePlaneNode = CreateParticlePlaneNode();
		particlePlaneNode.elementLoaded.Connect(() => {
			systemData.addToNodeGroup[NodeGroups.Render]!(particlePlaneNode.id);
		});
	});
}
