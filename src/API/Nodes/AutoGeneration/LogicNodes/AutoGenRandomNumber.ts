import type { RandomNumber } from "API/Nodes/Logic/RandomNumber";
import type { Src } from "API/VFXScriptCreator";

export function AutoGenRandomNumber(node: RandomNumber, src: Src, wrapper: string) {
    const className = `RandomNumber${node.id}`;
    const varName = `randomNumber${node.id}`;

    if (string.match(src.value, className)[0] === undefined) {
        src.value += `local ${className} = TS.import(script, APIFolder, "Nodes", "Logic", "RandomNumber").RandomNumber \n`;
        src.value += `local ${varName} = ${className}.new() \n\n`;

        node.nodeFields.range.AutoGenerateField(`${varName}.nodeFields.range`, src);

        src.value += "\n";
    }

    src.value += `${wrapper.gsub("%.%.", `${varName}`)[0]}\n`;
}
