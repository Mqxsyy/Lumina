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

	RemoveNode(node: T) {
		const index = this.Nodes.findIndex((n) => n.id === node.id);
		if (index !== -1) {
			this.Nodes.remove(index);
		}
	}

	GetNodes(): T[] {
		return this.Nodes;
	}
}
