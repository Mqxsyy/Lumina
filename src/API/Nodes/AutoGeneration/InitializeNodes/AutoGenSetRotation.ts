import type { SetRotationXYZ } from "API/Nodes/Initialize/SetRotationXYZ";

export function AutoGenSetRotationXYZ(node: SetRotationXYZ) {
    const className = `SetRotationXYZ${node.id}`;
    const varName = `setRotationXYZ${node.id}`;

    let src = `local ${className} = TS.import(script, APIFolder, "Nodes", "Initialize", "SetRotationXYZ").SetRotationXYZ \n`;
    src += `local ${varName} = ${className}.new() \n`;

    src += node.nodeFields.rotation.AutoGenerateField(`${varName}.nodeFields.rotation`);

    src += `nodeSystem:AddNode(${varName})`;
    return src;
}
