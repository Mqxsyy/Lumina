import { ClearParticles } from "./FolderLocations";
import { NodeSystem } from "./Systems/NodeSystem";
import { Lifetime } from "./Nodes/Initialize/Lifetime";
import { Position } from "./Nodes/Initialize/Position";
import { AliveTime } from "./Nodes/Logic/AliveTime";
import { RandomNumber } from "./Nodes/Logic/Math/RandomNumber";
import { ValueRamp } from "./Nodes/Logic/Math/ValueRamp";
import { ParticlePlane } from "./Nodes/Render/ParticlePlane";
import { ConstantSpawn } from "./Nodes/Spawn/ConstantSpawn";
import { StaticForce } from "./Nodes/Update/StaticForce";

export function CreateBasicNodeSystem() {
	ClearParticles();

	const nodeSystem = new NodeSystem();

	const constantSpawnNode = new ConstantSpawn();
	constantSpawnNode.nodeFields.rate.SetValue(5);
	nodeSystem.AddNode(constantSpawnNode);

	const randomNumberNode0 = new RandomNumber();
	randomNumberNode0.nodeFields.randomizeOnce.SetValue(true);
	randomNumberNode0.nodeFields.range.SetValue(new Vector2(1, 3));

	const lifetimeNode = new Lifetime();
	lifetimeNode.nodeFields.time.BindValue(randomNumberNode0.Calculate);
	nodeSystem.AddNode(lifetimeNode);

	const randomNumberNode1 = new RandomNumber();
	randomNumberNode1.nodeFields.range.SetValue(new Vector2(-5, 5));

	const positionNode = new Position();
	positionNode.nodeFields.position.SetValue(new Vector3(0, 10, 0));
	nodeSystem.AddNode(positionNode);

	positionNode.nodeFields.position.BindValueX(randomNumberNode1.Calculate);
	positionNode.nodeFields.position.BindValueZ(randomNumberNode1.Calculate);

	const randomNumberNode2 = new RandomNumber();
	randomNumberNode2.nodeFields.randomizeOnce.SetValue(true);
	randomNumberNode2.nodeFields.range.SetValue(new Vector2(0.025, 0.25));

	const staticForceNode = new StaticForce();
	staticForceNode.nodeFields.direction.BindValueY(randomNumberNode2.Calculate);
	staticForceNode.nodeFields.isLocal.SetValue(true);
	nodeSystem.AddNode(staticForceNode);

	const aliveTimeNode = new AliveTime();
	nodeSystem.AddNode(aliveTimeNode);

	const rampNode = new ValueRamp();
	rampNode.nodeFields.value.BindValue(aliveTimeNode.Calculate);
	nodeSystem.AddNode(rampNode);

	const particlePlane = new ParticlePlane();
	particlePlane.nodeFields.transparency.BindValue(rampNode.Calculate);
	particlePlane.nodeFields.color.SetValue(new Vector3(2, 2, 2));
	particlePlane.nodeFields.emission.SetValue(1);
	nodeSystem.AddNode(particlePlane);

	nodeSystem.Run();

	task.wait(5);

	nodeSystem.Stop();
}
