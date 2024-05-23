import type { NumberOut } from "API/Nodes/Logic/NumberOut";
import type { Src } from "API/VFXScriptCreator";

export function AutoGenNumberOut(node: NumberOut, src: Src, wrapper: string) {
    const className = `NumberOut${node.id}`;
    const varName = `numberOut${node.id}`;

    if (string.match(src.value, className)[0] === undefined) {
        src.value += `local ${className} = TS.import(script, APIFolder, "Nodes", "Logic", "NumberOut").NumberOut \n`;
        src.value += `local ${varName} = ${className}.new() \n\n`;

        node.nodeFields.input.AutoGenerateField(`${varName}.nodeFields.input`, src);

        src.value += "\n";
    }

    src.value += `${wrapper.gsub("%.%.", `${varName}`)[0]}\n`;
}
