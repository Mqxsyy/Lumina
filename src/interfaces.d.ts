type NodeElement = (
	index: number,
	canvasSize: UDim2,
	updateNodeOrder: (index: number) => void,
	updateAnchorPosition: (index: number, offset: Vector2) => void,
	removeNode: (index: number) => void,
	params: NodeParams,
	data: {},
) => import("@rbxts/roact").Element;

interface NodeParams {
	AnchorPosition: Vector2;
}

interface NodeData {
	Index: number;
	Node: NodeElement;
	Params: NodeParams;
	Data: {};
}
