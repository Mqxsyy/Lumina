import { TransparencyOverLife } from "API/Nodes/Update/TransparencyOverLife";

export function AutoGenTransparencyOverLife(node: TransparencyOverLife) {
	const className = `TransparencyOverLife${node.id}`;
	const varName = `TransparencyOverLife${node.id}`;

	let src = `local ${className} = TS.import(script, APIFolder, "Nodes", "Update", "TransparencyOverLife").TransparencyOverLife \n`;
	src += `local ${varName} = ${className}.new() \n`;
	src += `nodeSystem:AddNode(${varName})`;
	return src;
}