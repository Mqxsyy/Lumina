import type { Remap } from "API/Nodes/Logic/Remap";
import type { Src } from "API/VFXScriptCreator";

export function AutoGenRemap(node: Remap, src: Src, wrapper: string) {
    const className = `Remap${node.id}`;
    const varName = `remap${node.id}`;

    if (string.match(src.value, className)[0] === undefined) {
        src.value += `local ${className} = TS.import(script, APIFolder, "Nodes", "Logic", "Remap").Remap \n`;
        src.value += `local ${varName} = ${className}.new() \n\n`;

        node.nodeFields.input.AutoGenerateField(`${varName}.nodeFields.input`, src);
        node.nodeFields.oldRange.AutoGenerateField(`${varName}.nodeFields.oldRange`, src);
        node.nodeFields.newRange.AutoGenerateField(`${varName}.nodeFields.newRange`, src);

        src.value += "\n";
    }

    src.value += `${wrapper.gsub("%.%.", `${varName}`)[0]}\n`;
}
