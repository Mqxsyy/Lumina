import type { Subtract } from "API/Nodes/Logic/Subtract";
import type { Src } from "API/VFXScriptCreator";

export function AutoGenSubtract(node: Subtract, src: Src, wrapper: string) {
    const className = `Subtract${node.id}`;
    const varName = `subtract${node.id}`;

    if (string.match(src.value, className)[0] === undefined) {
        src.value += `local ${className} = TS.import(script, APIFolder, "Nodes", "Logic", "Subtract").Subtract \n`;
        src.value += `local ${varName} = ${className}.new() \n\n`;

        node.nodeFields.a.AutoGenerateField(`${varName}.nodeFields.a`, src);
        node.nodeFields.b.AutoGenerateField(`${varName}.nodeFields.b`, src);

        src.value += "\n";
    }

    src.value += `${wrapper.gsub("%.%.", `${varName}`)[0]}\n`;
}
