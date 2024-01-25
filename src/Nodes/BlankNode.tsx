import Roact from "@rbxts/roact";
import { Node } from "Components/Node";

export const BlankNode: NodeElement = (
	index: number,
	canvasSize: UDim2,
	updateNodeOrder: (index: number) => void,
	updateAnchorPosition: (index: number, offset: Vector2) => void,
	removeNode: (index: number) => void,
	params: NodeParams,
	data: {},
) => {
	return (
		<Node
			index={index}
			canvasSize={canvasSize}
			anchorPosition={params.AnchorPosition}
			updateNodeOrder={updateNodeOrder}
			updateAnchorPosition={updateAnchorPosition}
			removeNode={removeNode}
		/>
	);
};
