import type { AddRotationZ } from "API/Nodes/Update/AddRotationZ";

export function AutoGenAddRotationZ(node: AddRotationZ) {
    const className = `AddRotationZ${node.id}`;
    const varName = `addRotationZ${node.id}`;

    let src = `local ${className} = TS.import(script, APIFolder, "Nodes", "Update", "AddRotationZ").AddRotationZ \n`;
    src += `local ${varName} = ${className}.new() \n`;

    src += node.nodeFields.rotation.AutoGenerateField(`${varName}.nodeFields.rotation`);

    src += `nodeSystem:AddNode(${varName})`;
    return src;
}
