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
	const nodeIndex = Nodes.findIndex((node) => node.Id === id);
	delete Nodes[nodeIndex];

	// y da fq dos id change
	// Nodes.remove(nodeIndex);

	// const newArr = Nodes.filter((node) => node !== undefined);
	// print(newArr);
	// Nodes.clear();

	// newArr.forEach((node) => Nodes.push(node));

	NodesChanged.Fire();

	// print(Nodes);
}

export function UpdateNode(id: number, updateFunction: (node: NodeElement) => NodeElement) {}
