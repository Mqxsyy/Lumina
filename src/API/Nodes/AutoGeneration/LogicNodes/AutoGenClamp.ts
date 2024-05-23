import type { Clamp } from "API/Nodes/Logic/Clamp";
import type { Src } from "API/VFXScriptCreator";

export function AutoGenClamp(node: Clamp, src: Src, wrapper: string) {
    const className = `Clamp${node.id}`;
    const varName = `clamp${node.id}`;

    if (string.match(src.value, className)[0] === undefined) {
        src.value += `local ${className} = TS.import(script, APIFolder, "Nodes", "Logic", "Clamp").Clamp \n`;
        src.value += `local ${varName} = ${className}.new() \n\n`;

        node.nodeFields.input.AutoGenerateField(`${varName}.nodeFields.input`, src);
        node.nodeFields.range.AutoGenerateField(`${varName}.nodeFields.range`, src);

        src.value += "\n";
    }

    src.value += `${wrapper.gsub("%.%.", `${varName}`)[0]}\n`;
}
