import type { Time } from "API/Nodes/Logic/Time";
import type { Src } from "API/VFXScriptCreator";

export function AutoGenTime(node: Time, src: Src, wrapper: string) {
    const className = `Time${node.id}`;
    const varName = `time${node.id}`;

    if (string.match(src.value, className)[0] === undefined) {
        src.value += `local ${className} = TS.import(script, APIFolder, "Nodes", "Logic", "Time").Time \n`;
        src.value += `local ${varName} = ${className}.new() \n\n`;

        src.value += "\n";
    }

    src.value += `${wrapper.gsub("%.%.", `${varName}`)[0]}\n`;
}
