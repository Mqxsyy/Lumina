import { INode } from "./Nodes/Node";

export enum NodeGroups {
	Spawn,
	Initialize,
	Update,
	Render,
	Logic,
}

export class NodeGroup<T extends INode> {
	private Nodes: T[];

	constructor() {
		this.Nodes = [];
	}

	AddNode(node: T) {
		this.Nodes.push(node);
	}

	GetNodes(): T[] {
		return this.Nodes;
	}
}
