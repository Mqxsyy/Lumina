import { Cos } from "API/Nodes/Logic/Cos";

export function AutoGenCos(node: Cos, wrapper: string) {
    const className = `Cos${node.id}`;
    const varName = `cos${node.id}`;

    let src = "\n";
    src += `local ${className} = TS.import(script, APIFolder, "Nodes", "Logic", "Cos").Cos \n`;
    src += `local ${varName} = ${className}.new() \n`;

    src += node.nodeFields.input.AutoGenerateField(`${varName}.nodeFields.input`);

    src += wrapper.gsub("%.%.", `${varName}.Calculate`)[0] + "\n";
    return src;
}
