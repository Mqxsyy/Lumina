import { INodeField } from "../Fields/NodeField";
import { NodeGroups } from "../NodeGroup";
import { NodeTypes } from "./NodeTypes";

export interface ParticleInitData {
	lifetime?: number;
	spawnPosition?: Vector3;
}

export interface INode {
	id: number;
	nodeType: NodeTypes;
	nodeGroup: NodeGroups;
	nodeFields: INodeField[];
	fn(params?: unknown): unknown;
}

export abstract class Node implements INode {
	id: number;
	abstract nodeGroup: NodeGroups;
	abstract nodeType: NodeTypes;
	abstract nodeFields: INodeField[];

	constructor(id: number) {
		this.id = id;
	}

	abstract fn(params?: unknown): unknown;
}
