import { INode } from "./Nodes/Node";
import { NodeGroup, NodeGroups } from "./NodeGroup";
import { NodeTypes } from "./Nodes/NodeTypes";
import { RunService } from "@rbxts/services";
import { RenderNode, ParticleInitParams, ParticleUpdateParams, PositionUpdateFn } from "./Nodes/Render/RenderNode";
import { SpawnNode } from "./Nodes/Spawn/SpawnNode";
import { InitializeNode } from "./Nodes/Initialize/InitializeNode";
import { UpdateNode } from "./Nodes/Update/UpdateNode";
import { IdPool } from "./IdPool";

// OPTIMIZE: make less laggy
// OPTIMIZE?: look into an alt version for array.find

export class NodeSystem {
	ParticleIdPool = new IdPool();

	NodeGroups: { [key in NodeGroups]: NodeGroup<INode> };
	SpawnConnection: RBXScriptConnection | undefined;

	spawnNode: SpawnNode | undefined;
	initializeNodes = {
		lifetime: undefined as InitializeNode | undefined,
		position: undefined as InitializeNode | undefined,
	};
	updateNodes = {
		position: undefined as UpdateNode[] | undefined,
	};
	renderNode: RenderNode | undefined;

	constructor() {
		this.NodeGroups = {
			[NodeGroups.Spawn]: new NodeGroup<SpawnNode>(),
			[NodeGroups.Initialize]: new NodeGroup<InitializeNode>(),
			[NodeGroups.Update]: new NodeGroup<UpdateNode>(),
			[NodeGroups.Render]: new NodeGroup<RenderNode>(),
			[NodeGroups.Logic]: undefined as never,
		};
	}

	AddNode(node: INode) {
		this.NodeGroups[node.nodeGroup as NodeGroups].AddNode(node);
		this.UpdateNodes();
	}

	RemoveNode(node: INode) {
		this.NodeGroups[node.nodeGroup as NodeGroups].RemoveNode(node);
		this.UpdateNodes();
	}

	UpdateNodes() {
		let restart = false;

		if (this.SpawnConnection !== undefined) {
			this.Stop();
			restart = true;
		}

		this.ResetNodes();

		this.UpdateSpawnNodes();
		this.UpdateInitializeNodes();
		this.UpdateUpdateNodes();
		this.UpdateRenderNodes();

		if (restart) {
			this.Run();
		}
	}

	Run() {
		if (!this.CheckRequireNodes()) return;
		if (this.SpawnConnection !== undefined) {
			warn("System already running.");
			return;
		}

		switch (this.spawnNode!.nodeType) {
			case NodeTypes.BurstSpawn: {
				const amount = this.spawnNode!.GetValue() as number;

				for (let i = 0; i < amount; i++) {
					this.SpawnParticle();
				}

				break;
			}
			case NodeTypes.ConstantSpawn: {
				let rate = this.spawnNode!.GetValue() as number;
				let cd = 1 / rate;
				let amount = 1; // TODO: make amount more accurate, every 2nd frame spawns 2, every 3rd frame spawns 2, etc

				// OPTIMIZE: can bind multiple times to same node
				this.spawnNode!.nodeFields.rate.FieldChanged.Connect(() => {
					const newRate = this.spawnNode!.GetValue() as number;
					if (newRate !== rate) {
						rate = newRate;
						cd = 1 / rate;
						amount = math.ceil(rate / 60);
					}
				});

				let passedTime = 0;
				this.SpawnConnection = RunService.RenderStepped.Connect((dt) => {
					passedTime += dt;
					if (passedTime < cd) return;

					passedTime = 0;

					for (let i = 0; i < amount; i++) {
						this.SpawnParticle();
					}
				});

				break;
			}
		}
	}

	Stop(clearCache: boolean = false) {
		if (this.SpawnConnection !== undefined) {
			this.SpawnConnection.Disconnect();
			this.SpawnConnection = undefined;
		}

		if (clearCache) {
			const renderNodes = this.NodeGroups[NodeGroups.Render].GetNodes() as RenderNode[];
			if (renderNodes[0] !== undefined) {
				renderNodes[0].Destroy();
			}
		}
	}

	CheckRequireNodes(): boolean {
		let passedChecks = true;

		if (this.spawnNode === undefined) {
			warn("Missing spawn node.");
			passedChecks = false;
		}

		if (this.initializeNodes.lifetime === undefined) {
			warn("Missing lifetime node.");
			passedChecks = false;
		}

		if (this.renderNode === undefined) {
			warn("Missing render node.");
			passedChecks = false;
		}

		return passedChecks;
	}

	private SpawnParticle() {
		task.spawn(() => {
			const particleId = this.ParticleIdPool.GetNextId();
			const initParams: ParticleInitParams = {
				id: particleId,
				lifetime: this.initializeNodes.lifetime!.GetValue(particleId) as number,
			};

			if (this.initializeNodes.position !== undefined) {
				initParams.position = this.initializeNodes.position.GetValue(particleId) as Vector3;
			}

			const updateParams: ParticleUpdateParams = {
				position: this.updateNodes.position,
			};

			this.renderNode!.Render(initParams, updateParams);
		});
	}

	private ResetNodes() {
		this.spawnNode = undefined;

		for (const [k, _] of pairs(this.initializeNodes)) {
			this.initializeNodes[k] = undefined;
		}

		for (const [k, _] of pairs(this.updateNodes)) {
			this.updateNodes[k] = undefined;
		}

		this.renderNode = undefined;
	}

	private CheckNodesAmount(nodes: INode[]) {
		if (nodes.size() > 1) {
			warn("More than one node used, only one will be used.");
		}
	}

	private UpdateSpawnNodes() {
		const spawnNodes = this.NodeGroups[NodeGroups.Spawn].GetNodes();

		this.CheckNodesAmount(spawnNodes);
		if (spawnNodes.size() >= 1) {
			this.spawnNode = spawnNodes[0] as SpawnNode;
		}
	}

	private UpdateInitializeNodes() {
		const initializeNodes = this.NodeGroups[NodeGroups.Initialize].GetNodes();

		const lifetimeNodes = initializeNodes.filter((node) => node.nodeType === NodeTypes.Lifetime);

		this.CheckNodesAmount(lifetimeNodes);
		if (lifetimeNodes.size() >= 1) {
			this.initializeNodes.lifetime = lifetimeNodes[0] as InitializeNode;
		}

		const positionNodes = initializeNodes.filter((node) => node.nodeType === NodeTypes.Position);

		this.CheckNodesAmount(positionNodes);
		if (positionNodes.size() >= 1) {
			this.initializeNodes.position = positionNodes[0] as InitializeNode;
		}
	}

	private UpdateUpdateNodes() {
		const updateNodes = this.NodeGroups[NodeGroups.Update].GetNodes();

		const positionNodes = updateNodes.filter((node) => node.nodeType === NodeTypes.Position);

		if (positionNodes.size() >= 1) {
			if (this.updateNodes.position === undefined) {
				this.updateNodes.position = [];
			}

			positionNodes.forEach((node) => {
				this.updateNodes.position!.push(node as UpdateNode);
			});
		}
	}

	private UpdateRenderNodes() {
		const renderNodes = this.NodeGroups[NodeGroups.Render].GetNodes();

		this.CheckNodesAmount(renderNodes);
		if (renderNodes.size() >= 1) {
			this.renderNode = renderNodes[0] as RenderNode;
		}
	}
}
