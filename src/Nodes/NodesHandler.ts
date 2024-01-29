import { NodesChanged } from "Events";
import { GetMousePositionOnCanvas } from "WidgetHandler";

const NODE_Z_OFFSET = 5;
const NODE_Z_INCREMENTS = 2;

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
			AnchorPosition: pos,
			ZIndex: Nodes.size() * NODE_Z_INCREMENTS + NODE_Z_OFFSET - 1,
		},
		Data: {},
	});

	NodesChanged.Fire();
}

// sometimes node doesn't fully deleted but dupes and creates a permaa ghost node or smthin
// genuinely not sure of the cause
export function DeleteNode(id: number) {
	const nodeIndex = Nodes.findIndex((node) => node.Id === id);
	Nodes.remove(nodeIndex);

	NodesChanged.Fire();
}

// f this, wasted literal DAYS just to realize you need to use KEY attribute for arrays to work properly
export function UpdateNodePosition(id: number, mouseOffset: Vector2) {
	const nodeIndex = Nodes.findIndex((node) => node.Id === id);

	Nodes[nodeIndex].Params.AnchorPosition = GetMousePositionOnCanvas().add(mouseOffset);

	if (nodeIndex !== Nodes.size() - 1) {
		UpdateNodeRenderOrder(nodeIndex);
	}

	NodesChanged.Fire();
}

export function UpdateNodeRenderOrder(nodeIndex: number) {
	const node = Nodes.remove(nodeIndex) as NodeData;
	Nodes.push(node);

	Nodes.forEach((node, index) => {
		node.Params.ZIndex = index * NODE_Z_INCREMENTS + NODE_Z_OFFSET - 1;
	});
}
