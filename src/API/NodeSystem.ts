import { RunService } from "@rbxts/services";
import { IdPool } from "./IdPool";
import { NodeGroup, NodeGroups } from "./NodeGroup";
import { InitializeNode } from "./Nodes/Initialize/InitializeNode";
import { Node } from "./Nodes/Node";
import { SpawnNode } from "./Nodes/Spawn/SpawnNode";
import { UpdateNode } from "./Nodes/Update/UpdateNode";
import { RenderNode } from "./Nodes/Render/RenderNode";

// OPTIMIZE: make less laggy
// OPTIMIZE?: look into an alt version for array.find
// IMPROVE: split groups and make them connectable

if (!RunService.IsStudio()) {
	print(
		"This game utilizes a plugin called 'CrescentVFX' to create amazing looking visual effects. Plugin can be found in the toolbox or creator store for absolutely free.",
	);
}

export class NodeSystem {
	ParticleIdPool = new IdPool();

	NodeGroups: { [key in NodeGroups]: NodeGroup<Node> };
	SpawnConnection: RBXScriptConnection | undefined;

	spawnNode: SpawnNode | undefined;
	initializeNodes: InitializeNode[] = [];
	updateNodes: UpdateNode[] = [];
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

	AddNode(node: Node) {
		this.NodeGroups[node.nodeGroup as NodeGroups].AddNode(node);
		this.UpdateNodes();
	}

	RemoveNode(node: Node) {
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
		if (this.SpawnConnection !== undefined) {
			warn("System already running.");
			return;
		}

		if (this.spawnNode && this.renderNode) {
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

	private SpawnParticle() {
		task.spawn(() => {
			this.renderNode!.Render(this.initializeNodes, this.updateNodes);
		});
	}

	private ResetNodes() {
		this.spawnNode = undefined;
		this.initializeNodes = [];
		this.updateNodes = [];
		this.renderNode = undefined;
	}

	private UpdateSpawnNodes() {
		const spawnNodes = this.NodeGroups[NodeGroups.Spawn].GetNodes();

		if (spawnNodes.size() > 1) {
			warn("More than one node used, only one will be used.");
		}

		if (spawnNodes.size() >= 1) {
			this.spawnNode = spawnNodes[0] as SpawnNode;
		}
	}

	private UpdateInitializeNodes() {
		this.initializeNodes = this.NodeGroups[NodeGroups.Initialize].GetNodes() as InitializeNode[];
	}

	private UpdateUpdateNodes() {
		this.updateNodes = this.NodeGroups[NodeGroups.Update].GetNodes() as UpdateNode[];
	}

	private UpdateRenderNodes() {
		const renderNodes = this.NodeGroups[NodeGroups.Render].GetNodes();

		if (renderNodes.size() > 1) {
			warn("More than one node used, only one will be used.");
		}

		if (renderNodes.size() >= 1) {
			this.renderNode = renderNodes[0] as RenderNode;
		}
	}
}
