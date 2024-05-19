import type { Divide } from "API/Nodes/Logic/Divide";

export function AutoGenDivide(node: Divide, wrapper: string) {
    const className = `Divide${node.id}`;
    const varName = `divide${node.id}`;

    let src = "\n";
    src += `local ${className} = TS.import(script, APIFolder, "Nodes", "Logic", "Divide").Divide \n`;
    src += `local ${varName} = ${className}.new() \n`;

    src += node.nodeFields.a.AutoGenerateField(`${varName}.nodeFields.a`);
    src += node.nodeFields.b.AutoGenerateField(`${varName}.nodeFields.b`);

    src += `${wrapper.gsub("%.%.", `${varName}.Calculate`)[0]}\n`;
    return src;
}
