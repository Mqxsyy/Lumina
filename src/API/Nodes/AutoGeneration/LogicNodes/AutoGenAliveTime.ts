import type { AliveTime } from "API/Nodes/Logic/Alivetime";
import type { Src } from "API/VFXScriptCreator";

export function AutoGenAliveTime(node: AliveTime, src: Src, wrapper: string) {
    const className = `AliveTime${node.id}`;
    const varName = `aliveTime${node.id}`;

    if (string.match(src.value, className)[0] === undefined) {
        src.value += `local ${className} = TS.import(script, APIFolder, "Nodes", "Logic", "AliveTime").AliveTime \n`;
        src.value += `local ${varName} = ${className}.new() \n\n`;

        src.value += "\n";
    }

    src.value += `${wrapper.gsub("%.%.", `${varName}`)[0]}\n`;
}
