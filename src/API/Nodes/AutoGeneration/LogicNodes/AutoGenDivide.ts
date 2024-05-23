import type { Divide } from "API/Nodes/Logic/Divide";
import type { Src } from "API/VFXScriptCreator";

export function AutoGenDivide(node: Divide, src: Src, wrapper: string) {
    const className = `Divide${node.id}`;
    const varName = `divide${node.id}`;

    if (string.match(src.value, className)[0] === undefined) {
        src.value += `local ${className} = TS.import(script, APIFolder, "Nodes", "Logic", "Divide").Divide \n`;
        src.value += `local ${varName} = ${className}.new() \n\n`;

        node.nodeFields.a.AutoGenerateField(`${varName}.nodeFields.a`, src);
        node.nodeFields.b.AutoGenerateField(`${varName}.nodeFields.b`, src);

        src.value += "\n";
    }

    src.value += `${wrapper.gsub("%.%.", `${varName}`)[0]}\n`;
}
