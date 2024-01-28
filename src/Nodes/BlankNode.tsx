import Roact from "@rbxts/roact";
import { Node } from "Components/Node";

export const BlankNode: NodeElement = (id: number, canvasSize: UDim2, params: NodeParams) => {
	return <Node key={id} id={id} canvasSize={canvasSize} nodeParams={params} />;
};
