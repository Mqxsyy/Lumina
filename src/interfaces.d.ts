type NodeElement = (id: number, canvasSize: UDim2) => import("@rbxts/roact").Element;

interface NodeParams {
	ZIndex: number;
	AnchorPosition: Vector2;
}

interface NodeData {
	Id: number;
	Node: NodeElement;
	Params: NodeParams;
	Data: {};
}
