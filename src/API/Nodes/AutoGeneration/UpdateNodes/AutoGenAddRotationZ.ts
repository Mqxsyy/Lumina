import type { AddRotationZ } from "API/Nodes/Update/AddRotationZ";
import type { Src } from "API/VFXScriptCreator";

export function AutoGenAddRotationZ(node: AddRotationZ, src: Src) {
    const className = `AddRotationZ${node.id}`;
    const varName = `addRotationZ${node.id}`;

    src.value += `local ${className} = TS.import(script, APIFolder, "Nodes", "Update", "AddRotationZ").AddRotationZ \n`;
    src.value += `local ${varName} = ${className}.new() \n\n`;

    node.nodeFields.rotation.AutoGenerateField(`${varName}.nodeFields.rotation`, src);

    src.value += "\n";
    src.value += `nodeSystem:AddNode(${varName})`;
}
