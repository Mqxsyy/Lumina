import { INode } from "./Nodes/Node";

export enum NodeGroups {
	Spawn,
	Initialize,
	Update,
	Render,
}

export class NodeGroup {
	private Nodes: INode[];

	constructor() {
		this.Nodes = [];
	}

	AddNode(node: INode) {
		this.Nodes.push(node);
	}

	GetNodes(): INode[] {
		return this.Nodes;
	}
}
