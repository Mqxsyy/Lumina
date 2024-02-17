import { ClearParticles } from "./FolderLocations";
import { NodeSystem } from "./NodeSystem";
import { Lifetime } from "./Nodes/Initialize/Lifetime";
import { Position } from "./Nodes/Initialize/Position";
import { RandomNumberNode } from "./Nodes/Logic/Math/RandomNumberNode";
import { ParticlePlane } from "./Nodes/Render/ParticlePlane";
import { BurstSpawn } from "./Nodes/Spawn/BurstSpawn";
import { ConstantSpawnNode } from "./Nodes/Spawn/ConstantSpawn";
import { StaticForce } from "./Nodes/Update/StaticForce";

export function CreateBasicNodeSystem() {
	ClearParticles();

	const nodeSystem = new NodeSystem();

	const constantSpawnNode = new ConstantSpawnNode();
	constantSpawnNode.nodeFields.rate.SetValue(5);
	nodeSystem.AddNode(constantSpawnNode);

	const lifetimeNode = new Lifetime();
	lifetimeNode.nodeFields.time.SetValue(3);
	nodeSystem.AddNode(lifetimeNode);

	const randomNumberNode1 = new RandomNumberNode();
	randomNumberNode1.nodeFields.range.SetValue(new Vector2(-5, 5));

	const positionNode = new Position();
	positionNode.nodeFields.position.SetValue(new Vector3(0, 10, 0));
	nodeSystem.AddNode(positionNode);

	positionNode.nodeFields.position.BindValueX(randomNumberNode1.Calculate);
	positionNode.nodeFields.position.BindValueZ(randomNumberNode1.Calculate);

	const randomNumberNode2 = new RandomNumberNode();
	randomNumberNode2.nodeFields.randomizeOnce.SetValue(true);
	randomNumberNode2.nodeFields.range.SetValue(new Vector2(0.025, 0.25));

	const staticForceNode = new StaticForce();
	staticForceNode.nodeFields.direction.BindValueY(randomNumberNode2.Calculate);
	staticForceNode.nodeFields.isLocal.SetValue(true);
	nodeSystem.AddNode(staticForceNode);

	const particlePlane = new ParticlePlane();
	particlePlane.nodeFields.color.SetValue(new Vector3(0, 0, 0));
	particlePlane.nodeFields.emission.SetValue(0);
	nodeSystem.AddNode(particlePlane);

	nodeSystem.Run();

	task.wait(10);

	nodeSystem.Stop();
}
