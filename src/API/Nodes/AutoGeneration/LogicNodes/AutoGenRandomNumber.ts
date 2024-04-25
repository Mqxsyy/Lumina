import { RandomNumber } from "API/Nodes/Logic/RandomNumber";

export function AutoGenRandomNumber(node: RandomNumber, wrapper: string) {
	const className = `RandomNumber${node.id}`;
	const varName = `randomNumber${node.id}`;

	let src = `\n\n`;
	src = `local ${className} = TS.import(script, APIFolder, "Nodes", "Logic", "RandomNumber").RandomNumber \n`;
	src += `local ${varName} = ${className}.new() \n`;

	const range = node.nodeFields.range.GetVector2();
	src += `${varName}.nodeFields.range.SetX(${range.x}) \n`;
	src += `${varName}.nodeFields.range.SetY(${range.y}) \n`;

	src += wrapper.gsub("%.%.", `${varName}.Calculate`)[0] + "\n";
	return src;
}
