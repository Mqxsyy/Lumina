import type { SetSizeXYZ } from "API/Nodes/Initialize/SetSizeXYZ";

export function AutoGenSetSizeXYZ(node: SetSizeXYZ) {
    const className = `SetSizeXYZ${node.id}`;
    const varName = `setSizeXYZ${node.id}`;

    let src = `local ${className} = TS.import(script, APIFolder, "Nodes", "Initialize", "SetSizeXYZ").SetSizeXYZ \n`;
    src += `local ${varName} = ${className}.new() \n`;

    src += node.nodeFields.size.AutoGenerateField(`${varName}.nodeFields.size`);

    src += `nodeSystem:AddNode(${varName})`;
    return src;
}
