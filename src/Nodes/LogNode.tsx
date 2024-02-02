import Roact from "@rbxts/roact";
import { Node } from "Components/Node";
import { LogField } from "Components/NodeFields/LogField";

export const LogNode: NodeElement = (id: number, canvasData: CanvasData, params: NodeParams) => {
	const fields = [LogField];

	return <Node key={id} id={id} canvasData={canvasData} nodeParams={params} fields={fields} />;
};
