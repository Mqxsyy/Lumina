import { SetVelocity } from "API/Nodes/Initialize/SetVelocity";

export function AutoGenSetVelocity(node: SetVelocity) {
    const className = `SetVelocity${node.id}`;
    const varName = `setVelocity${node.id}`;

    let src = `local ${className} = TS.import(script, APIFolder, "Nodes", "Initialize", "SetVelocity").SetVelocity \n`;
    src += `local ${varName} = ${className}.new() \n`;
    const vec3 = node.nodeFields.velocity.GetVector3();
    src += `${varName}.nodeFields.velocity.SetVector3(${vec3.x},(${vec3.y},(${vec3.z}) \n`;
    src += `nodeSystem:AddNode(${varName})`;

    return src;
}
