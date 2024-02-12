import { NodeSystem } from "./NodeSystem";
import { GetNodeId } from "./Nodes/IdTracker";
import * as Nodes from "./Nodes/NodesBarrel";

export function CreateBasicNodeSystem() {
	const nodeSystem = new NodeSystem();

	const burstSpawnNode = new Nodes.SpawnNodes.BurstSpawn(GetNodeId());
	burstSpawnNode.nodeFields.amount.SetValue(10);
	nodeSystem.AddNode(burstSpawnNode);

	const lifetimeNode = new Nodes.InitializeNodes.Lifetime(GetNodeId());
	lifetimeNode.nodeFields.time.SetValue(2);
	nodeSystem.AddNode(lifetimeNode);

	const positionNode = new Nodes.InitializeNodes.Position(GetNodeId());
	positionNode.nodeFields.position.SetValue(new Vector3(0, 10, 0));
	nodeSystem.AddNode(positionNode);

	const staticForceNode = new Nodes.UpdateNodes.StaticForce(GetNodeId());
	staticForceNode.nodeFields.direction.SetValue(new Vector3(0, 0.1, 0));
	staticForceNode.nodeFields.isLocal.SetValue(true);
	nodeSystem.AddNode(staticForceNode);

	nodeSystem.AddNode(new Nodes.RenderNodes.ParticlePlane(GetNodeId()));

	nodeSystem.Run();
}
