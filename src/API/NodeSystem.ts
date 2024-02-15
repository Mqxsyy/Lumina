import { INode } from "./Nodes/Node";
import { NodeGroup, NodeGroups } from "./NodeGroup";
import { NodeTypes } from "./Nodes/NodeTypes";
import { RunService } from "@rbxts/services";
import { RenderNode, ParticleInitParams, ParticleUpdateParams, PositionUpdateFn } from "./Nodes/Render/RenderNode";
import { SpawnNode } from "./Nodes/Spawn/SpawnNode";
import { InitializeNode } from "./Nodes/Initialize/InitializeNode";
import { UpdateNode } from "./Nodes/Update/UpdateNode";
import { LogicNode } from "./Nodes/Logic/LogicNode";
import { IdPool } from "./IdPool";

// OPTIMIZE?: look into an alt version for array.find

export class NodeSystem {
	ParticleIdPool = new IdPool();

	NodeGroups: { [key in NodeGroups]: NodeGroup<INode> };
	SpawnConnection: RBXScriptConnection | undefined;

	constructor() {
		this.NodeGroups = {
			[NodeGroups.Spawn]: new NodeGroup<SpawnNode>(),
			[NodeGroups.Initialize]: new NodeGroup<InitializeNode>(),
			[NodeGroups.Update]: new NodeGroup<UpdateNode>(),
			[NodeGroups.Render]: new NodeGroup<RenderNode>(),
			[NodeGroups.Logic]: new NodeGroup<LogicNode>(),
		};
	}

	AddNode(node: INode) {
		this.NodeGroups[node.nodeGroup as NodeGroups].AddNode(node);
	}

	Run() {
		for (const [i, v] of pairs(this.NodeGroups)) {
			if (i === NodeGroups.Logic) continue;
			if (v.GetNodes().size() === 0) return;
		}

		const spawnNodes = this.NodeGroups[NodeGroups.Spawn].GetNodes();
		if (spawnNodes.size() > 1) {
			warn("More than one spawn node used, only the first will be used.");
		}

		const spawnNode = spawnNodes[0] as SpawnNode;

		if (spawnNode.nodeType === NodeTypes.BurstSpawn) {
			const amount = spawnNode.GetValue() as number;

			for (let i = 0; i < amount; i++) {
				task.spawn(() => {
					const initializeNodes = this.NodeGroups[NodeGroups.Initialize].GetNodes() as InitializeNode[];
					const lifetimeNode = initializeNodes.find((node) => node.nodeType === NodeTypes.Lifetime);
					const spawnPositionNode = initializeNodes.find((node) => node.nodeType === NodeTypes.Position);

					const updateNodes = this.NodeGroups[NodeGroups.Update].GetNodes() as UpdateNode[];
					const updatePositionNode = updateNodes.find((node) => node.nodeType === NodeTypes.Position);

					const particleId = this.ParticleIdPool.GetNextId();
					const InitParams: ParticleInitParams = {
						id: particleId,
						lifetime: lifetimeNode!.GetValue(particleId) as number,
						position: spawnPositionNode!.GetValue(particleId) as Vector3,
					};

					const UpdateParams: ParticleUpdateParams = {
						position: [updatePositionNode!.UpdateValue] as PositionUpdateFn[],
					};

					const outputNode = this.NodeGroups[NodeGroups.Render].GetNodes()[0] as RenderNode;

					outputNode.Render(InitParams, UpdateParams);
				});
			}
		} else if (spawnNode.nodeType === NodeTypes.ConstantSpawn) {
			let amount = spawnNode.GetValue() as number;
			let cd = math.round(1 / amount);
			let lastSpawn = os.time();

			this.SpawnConnection = RunService.RenderStepped.Connect(() => {
				const newAmount = spawnNode.GetValue() as number;
				if (newAmount !== amount) {
					amount = newAmount;
					cd = math.round(1 / amount);
				}

				if (os.time() - lastSpawn < cd) {
					return;
				}

				lastSpawn = os.time();

				const initializeNodes = this.NodeGroups[NodeGroups.Initialize].GetNodes() as InitializeNode[];
				const lifetimeNode = initializeNodes.find((node) => node.nodeType === NodeTypes.Lifetime);
				const spawnPositionNode = initializeNodes.find((node) => node.nodeType === NodeTypes.Position);

				const updateNodes = this.NodeGroups[NodeGroups.Update].GetNodes() as UpdateNode[];
				const updatePositionNode = updateNodes.find((node) => node.nodeType === NodeTypes.Position);

				const particleId = this.ParticleIdPool.GetNextId();
				const InitParams: ParticleInitParams = {
					id: particleId,
					lifetime: lifetimeNode!.GetValue(particleId) as number,
					position: spawnPositionNode!.GetValue(particleId) as Vector3,
				};

				const UpdateParams: ParticleUpdateParams = {
					position: [updatePositionNode!.UpdateValue] as PositionUpdateFn[],
				};

				const outputNode = this.NodeGroups[NodeGroups.Render].GetNodes()[0] as RenderNode;

				outputNode.Render(InitParams, UpdateParams);
			});
		}
	}

	Stop(clearCache: boolean = false) {
		if (this.SpawnConnection !== undefined) {
			this.SpawnConnection.Disconnect();
		}

		if (clearCache) {
			const renderNodes = this.NodeGroups[NodeGroups.Render].GetNodes() as RenderNode[];
			renderNodes[0].Destroy();
		}
	}
}
