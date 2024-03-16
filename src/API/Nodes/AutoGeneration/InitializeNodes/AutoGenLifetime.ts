import { Lifetime } from "API/Nodes/Initialize/Lifetime";

export function AutoGenLifetime(node: Lifetime) {
	const className = `Lifetime${node.id}`;
	const varName = `lifetime${node.id}`;

	let src = `local ${className} = TS.import(script, APIFolder, "Nodes", "Initialize", "Lifetime").Lifetime \n`;
	src += `local ${varName} = ${className}.new() \n`;

	if (node.nodeFields.time.valueBindNode !== undefined) {
		src += "\n";
		src += node.nodeFields.time.valueBindNode.GetAutoGenerationCode(`${varName}.nodeFields.time.BindValue(..)`);
		src += "\n";
	} else {
		src += `${varName}.nodeFields.time.SetValue(${node.nodeFields.time}) \n`;
	}

	src += `nodeSystem:AddNode(${varName})`;
	return src;
}
