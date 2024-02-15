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
	const nodeSystem = new NodeSystem();

	ClearParticles();

	const burstSpawnNode = new BurstSpawn();
	burstSpawnNode.nodeFields.amount.SetValue(10);
	nodeSystem.AddNode(burstSpawnNode);

	// const constantSpawnNode = new ConstantSpawnNode();
	// nodeSystem.AddNode(constantSpawnNode);

	const lifetimeNode = new Lifetime();
	lifetimeNode.nodeFields.time.SetValue(2);
	nodeSystem.AddNode(lifetimeNode);

	const randomNumberNode = new RandomNumberNode();
	randomNumberNode.nodeFields.range.SetValue(new Vector2(-10, 10));

	const positionNode = new Position();
	positionNode.nodeFields.position.SetValue(new Vector3(0, 10, 0));
	nodeSystem.AddNode(positionNode);

	positionNode.nodeFields.position.BindValueX(randomNumberNode.Calculate);
	positionNode.nodeFields.position.BindValueZ(randomNumberNode.Calculate);

	const staticForceNode = new StaticForce();
	staticForceNode.nodeFields.direction.SetValue(new Vector3(0, 0.1, 0));
	staticForceNode.nodeFields.isLocal.SetValue(true);
	nodeSystem.AddNode(staticForceNode);

	nodeSystem.AddNode(new ParticlePlane());

	nodeSystem.Run();
}
