import type { Multiply } from "API/Nodes/Logic/Multiply";
import type { Src } from "API/VFXScriptCreator";

export function AutoGenMultiply(node: Multiply, src: Src, wrapper: string) {
    const className = `Multiply${node.id}`;
    const varName = `multiply${node.id}`;

    if (string.match(src.value, className)[0] === undefined) {
        src.value += `local ${className} = TS.import(script, APIFolder, "Nodes", "Logic", "Multiply").Multiply \n`;
        src.value += `local ${varName} = ${className}.new() \n\n`;

        node.nodeFields.a.AutoGenerateField(`${varName}.nodeFields.a`, src);
        node.nodeFields.b.AutoGenerateField(`${varName}.nodeFields.b`, src);

        src.value += "\n";
    }

    src.value += `${wrapper.gsub("%.%.", `${varName}`)[0]}\n`;
}
