import { LowerFirstLetter } from "API/Lib";
import type { ParticleData } from "API/ParticleService";
import type { Src } from "API/VFXScriptCreator";
import { Node } from "../Node";

export abstract class LogicNode extends Node {
    abstract Calculate: (data: ParticleData) => unknown;
}

export function AutoGenLogicNode(node: LogicNode, src: Src, wrapper: string, createFields?: (varName: string) => void) {
    const nodeName = node.GetNodeName();

    const className = `${nodeName}${node.id}`;
    const varName = `${LowerFirstLetter(nodeName)}${node.id}`;

    if (string.match(src.value, className)[0] === undefined) {
        src.value += `local ${className} = TS.import(script, APIFolder, "Nodes", "Logic", "${nodeName}").${nodeName} \n`;
        src.value += `local ${varName} = ${className}.new() \n\n`;

        if (createFields !== undefined) {
            createFields(varName);
        }

        src.value += "\n";
    }

    src.value += `${wrapper.gsub("%.%.", `${varName}`)[0]}\n`;
}
