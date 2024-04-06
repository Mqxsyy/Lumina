import { SetRotationZ } from "API/Nodes/Initialize/SetRotationZ";

export function AutoGenSetRotationZ(node: SetRotationZ) {
	const className = `SetRotationZ${node.id}`;
	const varName = `setRotationZ${node.id}`;

	let src = `local ${className} = TS.import(script, APIFolder, "Nodes", "Initialize", "SetRotationZ").SetRotationZ \n`;
	src += `local ${varName} = ${className}.new() \n`;
	src += `${varName}.nodeFields.rotation.SetNumber(${node.nodeFields.rotation.GetNumber()}) \n`;
	src += `nodeSystem:AddNode(${varName})`;

	return src;
}
