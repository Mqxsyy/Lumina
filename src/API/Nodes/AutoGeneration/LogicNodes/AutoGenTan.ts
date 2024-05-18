import { Tan } from "API/Nodes/Logic/Tan";

export function AutoGenTan(node: Tan, wrapper: string) {
    const className = `Tan${node.id}`;
    const varName = `tan${node.id}`;

    let src = "\n";
    src += `local ${className} = TS.import(script, APIFolder, "Nodes", "Logic", "Tan").Tan \n`;
    src += `local ${varName} = ${className}.new() \n`;

    src += node.nodeFields.input.AutoGenerateField(`${varName}.nodeFields.input`);

    src += wrapper.gsub("%.%.", `${varName}.Calculate`)[0] + "\n";
    return src;
}
