import { AliveTime } from "API/Nodes/Logic/Alivetime";

export function AutoGenAliveTime(node: AliveTime, wrapper: string) {
    const className = `AliveTime${node.id}`;
    const varName = `aliveTime${node.id}`;

    let src = "\n";
    src += `local ${className} = TS.import(script, APIFolder, "Nodes", "Logic", "AliveTime").AliveTime \n`;
    src += `local ${varName} = ${className}.new() \n`;

    src += wrapper.gsub("%.%.", `${varName}.Calculate`)[0] + "\n";
    return src;
}
