import { Remap } from "API/Nodes/Logic/Remap";

export function AutoGenRemap(node: Remap, wrapper: string) {
    const className = `Remap${node.id}`;
    const varName = `remap${node.id}`;

    let src = "\n";
    src += `local ${className} = TS.import(script, APIFolder, "Nodes", "Logic", "Remap").Remap \n`;
    src += `local ${varName} = ${className}.new() \n`;

    src += node.nodeFields.input.AutoGenerateField(`${varName}.nodeFields.input`);
    src += node.nodeFields.oldRange.AutoGenerateField(`${varName}.nodeFields.oldRange`);
    src += node.nodeFields.newRange.AutoGenerateField(`${varName}.nodeFields.newRange`);

    src += wrapper.gsub("%.%.", `${varName}.Calculate`)[0] + "\n";
    return src;
}
