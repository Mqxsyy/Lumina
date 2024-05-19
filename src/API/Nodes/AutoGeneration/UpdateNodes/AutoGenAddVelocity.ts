import type { AddVelocity } from "API/Nodes/Update/AddVelocity";

export function AutoGenAddVelocity(node: AddVelocity) {
    const className = `AddVelocity${node.id}`;
    const varName = `addVelocity${node.id}`;

    let src = `local ${className} = TS.import(script, APIFolder, "Nodes", "Update", "AddVelocity").AddVelocity \n`;
    src += `local ${varName} = ${className}.new() \n`;

    src += node.nodeFields.velocity.AutoGenerateField(`${varName}.nodeFields.velocity`);

    src += `nodeSystem:AddNode(${varName})`;
    return src;
}
