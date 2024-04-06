import { SetTransparencyOverLife } from "API/Nodes/Update/SetTransparencyOverLife";

export function AutoGenTransparencyOverLife(node: SetTransparencyOverLife) {
	const className = `SetTransparencyOverLife${node.id}`;
	const varName = `transparencyOverLife${node.id}`;

	let src = `local ${className} = TS.import(script, APIFolder, "Nodes", "Update", "SetTransparencyOverLife").SetTransparencyOverLife \n`;
	src += `local ${varName} = ${className}.new() \n`;

	src += `${varName}.nodeFields.graph.startPoint.value = ${node.nodeFields.graph.startPoint.value} \n`;
	src += `${varName}.nodeFields.graph.endPoint.value = ${node.nodeFields.graph.endPoint.value} \n`;

	const graphPoints = node.nodeFields.graph.GetPoints();
	for (const point of graphPoints) {
		src += `${varName}.nodeFields.graph:AddPoint(${point.time}, ${point.value}) \n`;
	}

	src += `nodeSystem:AddNode(${varName})`;
	return src;
}
