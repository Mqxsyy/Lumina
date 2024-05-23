import type { SetRotationXYZ } from "API/Nodes/Initialize/SetRotationXYZ";
import type { Src } from "API/VFXScriptCreator";

export function AutoGenSetRotationXYZ(node: SetRotationXYZ, src: Src) {
    const className = `SetRotationXYZ${node.id}`;
    const varName = `setRotationXYZ${node.id}`;

    src.value += `local ${className} = TS.import(script, APIFolder, "Nodes", "Initialize", "SetRotationXYZ").SetRotationXYZ \n`;
    src.value += `local ${varName} = ${className}.new() \n\n`;

    node.nodeFields.rotation.AutoGenerateField(`${varName}.nodeFields.rotation`, src);

    src.value += "\n";
    src.value += `nodeSystem:AddNode(${varName})`;
}
