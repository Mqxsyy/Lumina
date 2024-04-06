import { AddRotationZRandom } from "API/Nodes/Update/AddRotationZRandom";

export function AutoGenAddRotationZRandom(node: AddRotationZRandom) {
	const className = `AddRotationZRandom${node.id}`;
	const varName = `addRotationZRandom${node.id}`;

	let src = `local ${className} = TS.import(script, APIFolder, "Nodes", "Update", "AddRotationZRandom").AddRotationZRandom \n`;
	src += `local ${varName} = ${className}.new() \n`;
	src += `${varName}.nodeFields.range.SetVector2(${node.nodeFields.range.GetVector2()}) \n`;
	src += `nodeSystem:AddNode(${varName})`;

	return src;
}
