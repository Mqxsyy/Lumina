import { NodesChanged } from "Events";

const Nodes: NodeData[] = [];

let currentId = 1;

export function GetNodeCollection() {
	return Nodes;
}

export function GetNode(id: number) {
	return Nodes.find((node) => node.Id === id) as NodeData;
}

export function CreateNode(node: NodeElement, pos: Vector2) {
	Nodes.push({
		Id: currentId++,
		Node: node,
		Params: {
			ZIndex: Nodes.size(),
			AnchorPosition: pos,
		},
		Data: {},
	});

	NodesChanged.Fire();
}

export function DeleteNode(id: number) {
	// NOTE: React is goofy af with arrays
	// therefore after multiple days of trying i just can not be bothered to find a dynamic soluiton anymore
	// especially since this is first and foremost a proof of concept and does not need to be perfect

	const nodeIndex = Nodes.findIndex((node) => node.Id === id);
	delete Nodes[nodeIndex];

	NodesChanged.Fire();
}

export function UpdateNode(id: number, updateFunction: (node: NodeElement) => NodeElement) {}
