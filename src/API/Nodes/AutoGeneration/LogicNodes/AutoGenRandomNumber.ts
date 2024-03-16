import { RandomNumber } from "API/Nodes/Logic/Math/RandomNumber";

export function AutoGenRandomNumber(node: RandomNumber, wrapper: string) {
	const className = `RandomNumber${node.id}`;
	const varName = `randomNumber${node.id}`;

	let src = `\n\n`;
	src = `local ${className} = TS.import(script, APIFolder, "Nodes", "Logic", "Math", "RandomNumber").RandomNumber \n`;
	src += `local ${varName} = ${className}.new() \n`;

	const range = node.nodeFields.range.GetValue();
	src += `${varName}.nodeFields.range.SetValueX(${range.X}) \n`;
	src += `${varName}.nodeFields.range.SetValueY(${range.Y}) \n`;

	src += wrapper.gsub("%.%.", `${varName}.Calculate`)[0] + "\n";
	return src;
}
