import { CreateConstantSpawn } from "Components/Nodes/Spawn/ConstantSpawn";
import { CreateEmptySystem } from "./CreateEmptySystem";
import { CreateSetLifetime } from "Components/Nodes/Initialize/SetLifetime";
import { CreateParticlePlane } from "Components/Nodes/Render/ParticlePlane";
import { NodeGroups } from "API/NodeGroup";
import { CreateSetPosition } from "Components/Nodes/Initialize/SetPosition";
import { SetPosition } from "API/Nodes/Initialize/SetPosition";
import { CreateSetVelocity } from "Lists/NodesListNodeBarrel";
import { SetVelocity } from "API/Nodes/Initialize/SetVelocity";

export function CreateBasicSystem() {
	const systemData = CreateEmptySystem();

	systemData.finishedBindingGroups.Connect(() => {
		const constantSpawn = CreateConstantSpawn();
		constantSpawn.elementLoaded.Connect(() => {
			systemData.addToNodeGroup[NodeGroups.Spawn]!(constantSpawn.node.id);
		});

		const setLifetime = CreateSetLifetime();
		setLifetime.elementLoaded.Connect(() => {
			systemData.addToNodeGroup[NodeGroups.Initialize]!(setLifetime.node.id);
		});

		const setPosition = CreateSetPosition();
		(setPosition.node as SetPosition).nodeFields.position.SetY(5);
		setPosition.elementLoaded.Connect(() => {
			systemData.addToNodeGroup[NodeGroups.Initialize]!(setPosition.node.id);
		});

		const setVelocity = CreateSetVelocity();
		(setVelocity.node as SetVelocity).nodeFields.velocity.SetY(5);
		setVelocity.elementLoaded.Connect(() => {
			systemData.addToNodeGroup[NodeGroups.Initialize]!(setVelocity.node.id);
		});

		const particlePlane = CreateParticlePlane();
		particlePlane.elementLoaded.Connect(() => {
			systemData.addToNodeGroup[NodeGroups.Render]!(particlePlane.node.id);
		});
	});

	return systemData;
}
