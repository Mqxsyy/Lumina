import type { Sin } from "API/Nodes/Logic/Sin";
import type { Src } from "API/VFXScriptCreator";

export function AutoGenSin(node: Sin, src: Src, wrapper: string) {
    const className = `Sin${node.id}`;
    const varName = `sin${node.id}`;

    if (string.match(src.value, className)[0] === undefined) {
        src.value += `local ${className} = TS.import(script, APIFolder, "Nodes", "Logic", "Sin").Sin \n`;
        src.value += `local ${varName} = ${className}.new() \n\n`;

        node.nodeFields.input.AutoGenerateField(`${varName}.nodeFields.input`, src);

        src.value += "\n";
    }

    src.value += `${wrapper.gsub("%.%.", `${varName}`)[0]}\n`;
}
