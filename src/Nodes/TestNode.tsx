import Roact from "@rbxts/roact";
import { Node } from "Components/Node";
import { TextField } from "Components/NodeFields/TextField";

export const TestNode: NodeElement = (id: number, canvasData: CanvasData, params: NodeParams) => {
	const fields = [TextField];

	return <Node key={id} id={id} canvasData={canvasData} nodeParams={params} fields={fields} />;
};
