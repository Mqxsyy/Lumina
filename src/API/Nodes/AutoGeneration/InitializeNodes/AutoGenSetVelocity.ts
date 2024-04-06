import { SetVelocity } from "API/Nodes/Initialize/SetVelocity";

export function AutoGenSetVelocity(node: SetVelocity) {
	const className = `SetVelocity${node.id}`;
	const varName = `setVelocity${node.id}`;

	let src = `local ${className} = TS.import(script, APIFolder, "Nodes", "Initialize", "SetVelocity").SetVelocity \n`;
	src += `local ${varName} = ${className}.new() \n`;
	src += `${varName}.nodeFields.velocity.SetVector3(${node.nodeFields.velocity.GetVector3()}) \n`;
	src += `nodeSystem:AddNode(${varName})`;

	return src;
}
