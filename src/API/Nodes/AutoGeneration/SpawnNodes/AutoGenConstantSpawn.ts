import { ConstantSpawn } from "API/Nodes/Spawn/ConstantSpawn";

export function AutoGenConstantSpawn(node: ConstantSpawn) {
	const className = `ConstantSpawn${node.id}`;
	const varName = `constantSpawn${node.id}`;

	let src = `local ${className} = TS.import(script, APIFolder, "Nodes", "Spawn", "ConstantSpawn").ConstantSpawn \n`;
	src += `local ${varName} = ${className}.new() \n`;
	src += `${varName}.nodeFields.rate.SetNumber(${node.nodeFields.rate.GetNumber()}) \n`;
	src += `nodeSystem:AddNode(${varName})`;

	return src;
}
