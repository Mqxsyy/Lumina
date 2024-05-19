import type { Subtract } from "API/Nodes/Logic/Subtract";

export function AutoGenSubtract(node: Subtract, wrapper: string) {
    const className = `Subtract${node.id}`;
    const varName = `subtract${node.id}`;

    let src = "\n";
    src += `local ${className} = TS.import(script, APIFolder, "Nodes", "Logic", "Subtract").Subtract \n`;
    src += `local ${varName} = ${className}.new() \n`;

    src += node.nodeFields.a.AutoGenerateField(`${varName}.nodeFields.a`);
    src += node.nodeFields.b.AutoGenerateField(`${varName}.nodeFields.b`);

    src += `${wrapper.gsub("%.%.", `${varName}.Calculate`)[0]}\n`;
    return src;
}
