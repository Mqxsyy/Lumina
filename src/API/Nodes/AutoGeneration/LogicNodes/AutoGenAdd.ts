import type { Add } from "API/Nodes/Logic/Add";
import type { Src } from "API/VFXScriptCreator";

export function AutoGenAdd(node: Add, src: Src, wrapper: string) {
    const className = `Add${node.id}`;
    const varName = `add${node.id}`;

    if (string.match(src.value, className)[0] === undefined) {
        src.value += `local ${className} = TS.import(script, APIFolder, "Nodes", "Logic", "Add").Add \n`;
        src.value += `local ${varName} = ${className}.new() \n\n`;

        node.nodeFields.a.AutoGenerateField(`${varName}.nodeFields.a`, src);
        node.nodeFields.b.AutoGenerateField(`${varName}.nodeFields.b`, src);

        src.value += "\n";
    }

    src.value += `${wrapper.gsub("%.%.", `${varName}`)[0]}\n`;
}
