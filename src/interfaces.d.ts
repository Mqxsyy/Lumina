type NodeElement = (id: number, CanvasData: CanvasData, params: NodeParams) => import("@rbxts/roact").Element;

interface CanvasData {
	size: UDim2;
	isMoving: boolean;
}

interface NodeFieldProps {
	ZIndex: number;
}

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
