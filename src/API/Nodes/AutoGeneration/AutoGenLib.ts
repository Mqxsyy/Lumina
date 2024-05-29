import { LowerFirstLetter } from "API/Lib";
import type { Src } from "API/VFXScriptCreator";
import type { Node } from "../Node";

export function AutoGenImport(node: Node, src: Src) {
    const nodeName = node.GetNodeName();

    const className = `${nodeName}${node.id}`;
    const varName = `${LowerFirstLetter(nodeName)}${node.id}`;

    src.value += `local ${className} = TS.import(script, APIFolder, "Nodes", "Update", "${nodeName}").${nodeName} \n`;
    src.value += `local ${varName} = ${className}.new() \n\n`;

    return varName;
}

export function AutoGenAddToSystem(nodeName: string, src: Src) {
    src.value += "\n";
    src.value += `nodeSystem:AddNode(${nodeName})`;
}
