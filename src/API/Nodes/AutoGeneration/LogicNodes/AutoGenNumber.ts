import { Number } from "API/Nodes/Logic/Number";

export function AutoGenNumber(node: Number, wrapper: string) {
    const className = `Number${node.id}`;
    const varName = `number${node.id}`;

    let src = "\n";
    src += `local ${className} = TS.import(script, APIFolder, "Nodes", "Logic", "Number").Number \n`;
    src += `local ${varName} = ${className}.new() \n`;

    src += node.nodeFields.input.AutoGenerateField(`${varName}.nodeFields.input`);

    src += wrapper.gsub("%.%.", `${varName}.Calculate`)[0] + "\n";
    return src;
}
