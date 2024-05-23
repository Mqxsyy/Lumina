import type { SetRotationZ } from "API/Nodes/Initialize/SetRotationZ";
import type { Src } from "API/VFXScriptCreator";

export function AutoGenSetRotationZ(node: SetRotationZ, src: Src) {
    const className = `SetRotationZ${node.id}`;
    const varName = `setRotationZ${node.id}`;

    src.value = `local ${className} = TS.import(script, APIFolder, "Nodes", "Initialize", "SetRotationZ").SetRotationZ \n`;
    src.value += `local ${varName} = ${className}.new() \n\n`;

    node.nodeFields.rotation.AutoGenerateField(`${varName}.nodeFields.rotation`, src);

    src.value += "\n";
    src.value += `nodeSystem:AddNode(${varName})`;
}
