import type { Cos } from "API/Nodes/Logic/Cos";
import type { Src } from "API/VFXScriptCreator";

export function AutoGenCos(node: Cos, src: Src, wrapper: string) {
    const className = `Cos${node.id}`;
    const varName = `cos${node.id}`;

    if (string.match(src.value, className)[0] === undefined) {
        src.value += `local ${className} = TS.import(script, APIFolder, "Nodes", "Logic", "Cos").Cos \n`;
        src.value += `local ${varName} = ${className}.new() \n\n`;

        node.nodeFields.input.AutoGenerateField(`${varName}.nodeFields.input`, src);

        src.value += "\n";
    }

    src.value += `${wrapper.gsub("%.%.", `${varName}`)[0]}\n`;
}
