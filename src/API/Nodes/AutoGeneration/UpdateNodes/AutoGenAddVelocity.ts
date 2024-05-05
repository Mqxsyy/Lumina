import { AddVelocity } from "API/Nodes/Update/AddVelocity";

export function AutoGenAddVelocity(node: AddVelocity) {
    const className = `AddVelocity${node.id}`;
    const varName = `AddVelocity${node.id}`;

    let src = `local ${className} = TS.import(script, APIFolder, "Nodes", "Update", "AddVelocity").AddVelocity \n`;
    src += `local ${varName} = ${className}.new() \n`;
    const vec3 = node.nodeFields.velocity.GetVector3();
    src += `${varName}.nodeFields.velocity.SetVector3(${vec3.x},${vec3.y},${vec3.z}) \n`;
    src += `nodeSystem:AddNode(${varName})`;

    return src;
}
