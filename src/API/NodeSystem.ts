import { INode } from "./Nodes/Node";
import { NodeGroup, NodeGroups } from "./NodeGroup";
import { RunService } from "@rbxts/services";
import { NodeTypes } from "./Nodes/NodeTypes";

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

	AddNode(node: INode) {
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

					const lifetime = lifetimeNode!.fn() as number;

					const outputNode = this.NodeGroups[NodeGroups.Spawn].GetNodes()[0];
					outputNode.fn();

					let aliveTime = 0;
					let position = spawnPositionNode!.fn() as Vector3;
					const connection = RunService.RenderStepped.Connect((dt) => {
						if (aliveTime >= lifetime) {
							connection.Disconnect();
						}

						position = updatePositionNode!.fn(position) as Vector3;
						print(position);
						aliveTime += dt;
					});
				});
			}
		}
	}
}
