import { Clamp } from "API/Nodes/Logic/Clamp";

export function AutoGenClamp(node: Clamp, wrapper: string) {
    const className = `Clamp${node.id}`;
    const varName = `clamp${node.id}`;

    let src = "\n";
    src += `local ${className} = TS.import(script, APIFolder, "Nodes", "Logic", "Clamp").Clamp \n`;
    src += `local ${varName} = ${className}.new() \n`;

    src += node.nodeFields.input.AutoGenerateField(`${varName}.nodeFields.input`);
    src += node.nodeFields.range.AutoGenerateField(`${varName}.nodeFields.range`);

    src += wrapper.gsub("%.%.", `${varName}.Calculate`)[0] + "\n";
    return src;
}
