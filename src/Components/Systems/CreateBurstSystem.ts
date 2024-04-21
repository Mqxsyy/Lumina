import { NodeGroups } from "API/NodeGroup";
import { SetLifetimeRandom } from "API/Nodes/Initialize/SetLifetimeRandom";
import { SetPosition } from "API/Nodes/Initialize/SetPosition";
import { SetVelocityRandom } from "API/Nodes/Initialize/SetVelocityRandom";
import { CreateSetPosition } from "Components/Nodes/Initialize/SetPosition";
import { CreateParticlePlane } from "Components/Nodes/Render/ParticlePlane";
import { CreateBurstSpawn } from "Components/Nodes/Spawn/BurstSpawn";
import { CreateSetLifetimeRandom, CreateSetVelocityRandom } from "Lists/NodesListNodeBarrel";
import { CreateEmptySystem } from "./CreateEmptySystem";

export function CreateBurstSystem() {
	const systemData = CreateEmptySystem();

	systemData.finishedBindingGroups.Connect(() => {
		const burstSpawn = CreateBurstSpawn();
		burstSpawn.elementLoaded.Connect(() => {
			systemData.addToNodeGroup[NodeGroups.Spawn]!(burstSpawn.node.id);
		});

		const setLifetimeRandom = CreateSetLifetimeRandom();
		(setLifetimeRandom.node as SetLifetimeRandom).nodeFields.range.SetVector2(0.4, 0.8);
		setLifetimeRandom.elementLoaded.Connect(() => {
			systemData.addToNodeGroup[NodeGroups.Initialize]!(setLifetimeRandom.node.id);
		});

		const positionNode = CreateSetPosition();
		(positionNode.node as SetPosition).nodeFields.position.SetY(5);
		positionNode.elementLoaded.Connect(() => {
			systemData.addToNodeGroup[NodeGroups.Initialize]!(positionNode.node.id);
		});

		const setVelocityRandom = CreateSetVelocityRandom();
		(setVelocityRandom.node as SetVelocityRandom).nodeFields.rangeX.SetVector2(-5, 5);
		(setVelocityRandom.node as SetVelocityRandom).nodeFields.rangeY.SetVector2(-5, 5);
		(setVelocityRandom.node as SetVelocityRandom).nodeFields.rangeZ.SetVector2(-5, 5);
		setVelocityRandom.elementLoaded.Connect(() => {
			systemData.addToNodeGroup[NodeGroups.Initialize]!(setVelocityRandom.node.id);
		});

		const particlePlane = CreateParticlePlane();
		particlePlane.elementLoaded.Connect(() => {
			systemData.addToNodeGroup[NodeGroups.Render]!(particlePlane.node.id);
		});
	});

	return systemData;
}
