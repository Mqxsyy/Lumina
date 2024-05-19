import type { Multiply } from "API/Nodes/Logic/Multiply";

export function AutoGenMultiply(node: Multiply, wrapper: string) {
    const className = `Multiply${node.id}`;
    const varName = `multiply${node.id}`;

    let src = "\n";
    src += `local ${className} = TS.import(script, APIFolder, "Nodes", "Logic", "Multiply").Multiply \n`;
    src += `local ${varName} = ${className}.new() \n`;

    src += node.nodeFields.a.AutoGenerateField(`${varName}.nodeFields.a`);
    src += node.nodeFields.b.AutoGenerateField(`${varName}.nodeFields.b`);

    src += `${wrapper.gsub("%.%.", `${varName}.Calculate`)[0]}\n`;
    return src;
}
