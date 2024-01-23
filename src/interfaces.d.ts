type NodeElement = (
	canvasSize: UDim2,
	updateAnchorPosition: (index: number, offset: Vector2) => void,
	removeNode: (index: number) => void,
	params: NodeParams,
	data: {},
) => import("@rbxts/roact").Element;

interface NodeParams {
	Index: number;
	AnchorPosition: Vector2;
}

interface NodeData {
	Node: NodeElement;
	Params: NodeParams;
	Data: {};
}
