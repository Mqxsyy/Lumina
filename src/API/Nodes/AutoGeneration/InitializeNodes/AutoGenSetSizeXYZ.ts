import type { SetSizeXYZ } from "API/Nodes/Initialize/SetSizeXYZ";
import type { Src } from "API/VFXScriptCreator";

export function AutoGenSetSizeXYZ(node: SetSizeXYZ, src: Src) {
    const className = `SetSizeXYZ${node.id}`;
    const varName = `setSizeXYZ${node.id}`;

    src.value += `local ${className} = TS.import(script, APIFolder, "Nodes", "Initialize", "SetSizeXYZ").SetSizeXYZ \n`;
    src.value += `local ${varName} = ${className}.new() \n\n`;

    node.nodeFields.size.AutoGenerateField(`${varName}.nodeFields.size`, src);

    src.value += "\n";
    src.value += `nodeSystem:AddNode(${varName})`;
}
