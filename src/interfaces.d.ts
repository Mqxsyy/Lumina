type NodeElement = (id: number, canvasSize: UDim2, params: NodeParams) => import("@rbxts/roact").Element;

interface NodeParams {
	AnchorPosition: Vector2;
	ZIndex: number;
}

interface NodeData {
	Id: number;
	Node: NodeElement;
	Params: NodeParams;
	Data: {};
}
