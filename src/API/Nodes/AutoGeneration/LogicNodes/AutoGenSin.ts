import { Sin } from "API/Nodes/Logic/Sin";

export function AutoGenSin(node: Sin, wrapper: string) {
    const className = `Sin${node.id}`;
    const varName = `sin${node.id}`;

    let src = "\n";
    src += `local ${className} = TS.import(script, APIFolder, "Nodes", "Logic", "Sin").Sin \n`;
    src += `local ${varName} = ${className}.new() \n`;

    src += node.nodeFields.input.AutoGenerateField(`${varName}.nodeFields.input`);

    src += wrapper.gsub("%.%.", `${varName}.Calculate`)[0] + "\n";
    return src;
}
