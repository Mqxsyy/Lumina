import type { Tan } from "API/Nodes/Logic/Tan";
import type { Src } from "API/VFXScriptCreator";

export function AutoGenTan(node: Tan, src: Src, wrapper: string) {
    const className = `Tan${node.id}`;
    const varName = `tan${node.id}`;

    if (string.match(src.value, className)[0] === undefined) {
        src.value += `local ${className} = TS.import(script, APIFolder, "Nodes", "Logic", "Tan").Tan \n`;
        src.value += `local ${varName} = ${className}.new() \n\n`;

        node.nodeFields.input.AutoGenerateField(`${varName}.nodeFields.input`, src);

        src.value += "\n";
    }

    src.value += `${wrapper.gsub("%.%.", `${varName}`)[0]}\n`;
}
