import type { SetVelocity } from "API/Nodes/Initialize/SetVelocity";

export function AutoGenSetVelocity(node: SetVelocity) {
    const className = `SetVelocity${node.id}`;
    const varName = `setVelocity${node.id}`;

    let src = `local ${className} = TS.import(script, APIFolder, "Nodes", "Initialize", "SetVelocity").SetVelocity \n`;
    src += `local ${varName} = ${className}.new() \n`;

    src += node.nodeFields.velocity.AutoGenerateField(`${varName}.nodeFields.velocity`);

    src += `nodeSystem:AddNode(${varName})`;
    return src;
}
