import Roact from "@rbxts/roact";
import { Node } from "Components/Node";

export const BlankNode: NodeElement = (id: number, canvasData: CanvasData, params: NodeParams) => {
	return <Node key={id} id={id} canvasData={canvasData} nodeParams={params} />;
};
