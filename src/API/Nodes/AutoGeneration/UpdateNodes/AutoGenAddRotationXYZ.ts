import type { AddRotationXYZ } from "API/Nodes/Update/AddRotationXYZ";
import type { Src } from "API/VFXScriptCreator";

export function AutoGenAddRotationXYZ(node: AddRotationXYZ, src: Src) {
    const className = `AddRotationXYZ${node.id}`;
    const varName = `addRotationXYZ${node.id}`;

    src.value += `local ${className} = TS.import(script, APIFolder, "Nodes", "Update", "AddRotationXYZ").AddRotationXYZ \n`;
    src.value += `local ${varName} = ${className}.new() \n\n`;

    node.nodeFields.rotation.AutoGenerateField(`${varName}.nodeFields.rotation`, src);

    src.value += "\n";
    src.value += `nodeSystem:AddNode(${varName})`;
}
