import { INodeField } from "../Fields/NodeField";
import { NodeGroups } from "../NodeGroup";
import { NodeIdPool } from "./NodeIdPool";
import { NodeTypes } from "./NodeTypes";

export interface ParticleInitData {
	lifetime?: number;
	spawnPosition?: Vector3;
}

export interface INode {
	id: number;
	nodeType: NodeTypes;
	nodeGroup: NodeGroups;
	nodeFields: { [key: string]: INodeField };
	GetAutoGenerationCode(): string;
}

export abstract class Node implements INode {
	id: number;
	abstract nodeGroup: NodeGroups;
	abstract nodeType: NodeTypes;
	abstract nodeFields: { [key: string]: INodeField };

	constructor() {
		this.id = NodeIdPool.GetNextId();
	}

	abstract GetAutoGenerationCode(): string;
}
