import { RandomNumber } from "API/Nodes/Logic/RandomNumber";

export function AutoGenRandomNumber(node: RandomNumber, wrapper: string) {
    const className = `RandomNumber${node.id}`;
    const varName = `randomNumber${node.id}`;

    let src = "\n";
    src += `local ${className} = TS.import(script, APIFolder, "Nodes", "Logic", "RandomNumber").RandomNumber \n`;
    src += `local ${varName} = ${className}.new() \n`;

    src += node.nodeFields.range.AutoGenerateField(`${varName}.nodeFields.min`);

    src += wrapper.gsub("%.%.", `${varName}.Calculate`)[0] + "\n";
    return src;
}
