type NodeElement = (
	canvasSize: UDim2,
	UpdateAnchorPosition: (index: number, offset: Vector2) => void,
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
