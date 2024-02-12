import { INodeField } from "../Fields/NodeField";
import { NodeGroups } from "../NodeGroup";
import { GetNodeId } from "./IdTracker";
import { NodeTypes } from "./NodeTypes";

export interface ParticleInitData {
	lifetime?: number;
	spawnPosition?: Vector3;
}

export interface INode<T extends unknown[] = []> {
	id: number;
	nodeType: NodeTypes;
	nodeGroup: NodeGroups;
	nodeFields: { [key: string]: INodeField };
	fn: (...params: T) => unknown;
}

// bro these type definitions feel soo weird and overkill
export abstract class Node<T extends unknown[] = []> implements INode<T> {
	id: number;
	abstract nodeGroup: NodeGroups;
	abstract nodeType: NodeTypes;
	abstract nodeFields: { [key: string]: INodeField };

	constructor() {
		this.id = GetNodeId();
	}

	abstract fn: (...params: T) => unknown;
}
