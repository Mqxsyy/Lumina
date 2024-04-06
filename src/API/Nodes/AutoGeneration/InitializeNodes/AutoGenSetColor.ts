import { SetColor } from "API/Nodes/Initialize/SetColor";

export function AutoGenSetColor(node: SetColor) {
	const className = `SetColor${node.id}`;
	const varName = `setColor${node.id}`;

	let src = `local ${className} = TS.import(script, APIFolder, "Nodes", "Initialize", "SetColor").SetColor \n`;

	src += `local ${varName} = ${className}.new() \n`;
	src += `${varName}.nodeFields.color.SetColor(${node.nodeFields.color.hue}, ${node.nodeFields.color.saturation}, ${node.nodeFields.color.value}) \n`;
	src += `nodeSystem:AddNode(${varName})`;

	return src;
}
