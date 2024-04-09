import { SetSizeOverLife } from "API/Nodes/Update/SetSizeOverLife";

export function AutoGenSetSizeOverLife(node: SetSizeOverLife) {
	const className = `SetSizeOverLife${node.id}`;
	const varName = `multiplySizeOverLife${node.id}`;

	let src = `local ${className} = TS.import(script, APIFolder, "Nodes", "Update", "SetSizeOverLife").SetSizeOverLife \n`;
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