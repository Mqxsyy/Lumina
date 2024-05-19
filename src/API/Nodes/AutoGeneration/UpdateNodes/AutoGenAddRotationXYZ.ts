import type { AddRotationXYZ } from "API/Nodes/Update/AddRotationXYZ";

export function AutoGenAddRotationXYZ(node: AddRotationXYZ) {
    const className = `AddRotationXYZ${node.id}`;
    const varName = `addRotationXYZ${node.id}`;

    let src = `local ${className} = TS.import(script, APIFolder, "Nodes", "Update", "AddRotationXYZ").AddRotationXYZ \n`;
    src += `local ${varName} = ${className}.new() \n`;

    src += node.nodeFields.rotation.AutoGenerateField(`${varName}.nodeFields.rotation`);

    src += `nodeSystem:AddNode(${varName})`;
    return src;
}
