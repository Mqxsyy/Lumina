import { INode } from "./Nodes/Node";
import { NodeGroup, NodeGroups } from "./NodeGroup";
import { NodeTypes } from "./Nodes/NodeTypes";
import { ParticleInitParams, ParticleUpdateParams, PositionUpdateFn } from "./Nodes/Render/ParticlePlane";

export class NodeSystem {
	NodeGroups: { [key in NodeGroups]: NodeGroup };

	constructor() {
		this.NodeGroups = {
			[NodeGroups.Spawn]: new NodeGroup(),
			[NodeGroups.Initialize]: new NodeGroup(),
			[NodeGroups.Update]: new NodeGroup(),
			[NodeGroups.Render]: new NodeGroup(),
		};
	}

	AddNode<T extends unknown[]>(node: INode<T>) {
		this.NodeGroups[node.nodeGroup].AddNode(node);
	}

	Run() {
		for (const [_, v] of pairs(this.NodeGroups)) {
			if (v.GetNodes().size() === 0) return;
		}

		const spawnNode = this.NodeGroups[NodeGroups.Spawn].GetNodes()[0];
		if (spawnNode.nodeType === NodeTypes.BurstSpawn) {
			const amount = spawnNode.fn() as number;

			for (let i = 0; i < amount; i++) {
				task.spawn(() => {
					const initializeNodes = this.NodeGroups[NodeGroups.Initialize].GetNodes();
					const lifetimeNode = initializeNodes.find((node) => node.nodeType === NodeTypes.Lifetime);
					const spawnPositionNode = initializeNodes.find((node) => node.nodeType === NodeTypes.Position);

					const updateNodes = this.NodeGroups[NodeGroups.Update].GetNodes();
					const updatePositionNode = updateNodes.find((node) => node.nodeType === NodeTypes.Position);

					const InitParams: ParticleInitParams = {
						lifetime: lifetimeNode!.fn() as number,
						position: spawnPositionNode!.fn() as Vector3,
					};

					const UpdateParams: ParticleUpdateParams = {
						position: [updatePositionNode!.fn] as PositionUpdateFn[],
					};

					const outputNode = this.NodeGroups[NodeGroups.Render].GetNodes()[0] as INode<
						[ParticleInitParams, ParticleUpdateParams]
					>;

					outputNode.fn(InitParams, UpdateParams);
				});
			}
		}
	}
}
