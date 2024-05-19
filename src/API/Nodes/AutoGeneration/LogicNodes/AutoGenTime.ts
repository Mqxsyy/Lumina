import type { Time } from "API/Nodes/Logic/Time";

export function AutoGenTime(node: Time, wrapper: string) {
    const className = `Time${node.id}`;
    const varName = `time${node.id}`;

    let src = "\n";
    src += `local ${className} = TS.import(script, APIFolder, "Nodes", "Logic", "Time").Time \n`;
    src += `local ${varName} = ${className}.new() \n`;

    src += `${wrapper.gsub("%.%.", `${varName}.Calculate`)[0]}\n`;
    return src;
}
