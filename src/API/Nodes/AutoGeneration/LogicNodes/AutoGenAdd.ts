import { Add } from "API/Nodes/Logic/Add";

export function AutoGenAdd(node: Add, wrapper: string) {
    const className = `Add${node.id}`;
    const varName = `add${node.id}`;

    let src = "\n";
    src += `local ${className} = TS.import(script, APIFolder, "Nodes", "Logic", "Add").Add \n`;
    src += `local ${varName} = ${className}.new() \n`;

    src += node.nodeFields.a.AutoGenerateField(`${varName}.nodeFields.a`);
    src += node.nodeFields.b.AutoGenerateField(`${varName}.nodeFields.b`);

    src += wrapper.gsub("%.%.", `${varName}.Calculate`)[0] + "\n";
    return src;
}
