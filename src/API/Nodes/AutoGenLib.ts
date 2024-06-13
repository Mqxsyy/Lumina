import { LowerFirstLetter } from "API/Lib";
import type { NodeGroups } from "API/NodeGroup";
import type { Src } from "API/VFXScriptCreator";
import type { Node } from "./Node";

export function AutoGenImport(node: Node, src: Src) {
    const nodeName = node.GetClassName();

    const className = `${nodeName}${node.id}`;
    const varName = `${LowerFirstLetter(nodeName)}${node.id}`;

    src.value += `local ${className} = TS.import(script, APIFolder, "Nodes", "${node.GetNodeFolderName()}", "${nodeName}").${nodeName} \n`;
    src.value += `local ${varName} = ${className}.new() \n\n`;

    return varName;
}

export function AutoGenAddToSystem(nodeName: string, nodeGroup: NodeGroups, src: Src) {
    src.value += "\n";
    src.value += `nodeSystem:AddNode(${nodeName}, ${nodeGroup})`;
}
