import Roact from "@rbxts/roact";
import { Node } from "Components/Node";

export const BlankNode: NodeElement = (id: number, canvasSize: UDim2) => {
	return <Node id={id} canvasSize={canvasSize} />;
};
