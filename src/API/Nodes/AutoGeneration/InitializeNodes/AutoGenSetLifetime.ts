import { SetLifetime } from "API/Nodes/Initialize/SetLifetime";

export function AutoGenSetLifetime(node: SetLifetime) {
    const className = `SetLifetime${node.id}`;
    const varName = `setLifetime${node.id}`;

    let src = `local ${className} = TS.import(script, APIFolder, "Nodes", "Initialize", "SetLifetime").SetLifetime \n`;
    src += `local ${varName} = ${className}.new() \n`;

    src += node.nodeFields.time.AutoGenerateField(`${varName}.nodeFields.time`);

    src += `nodeSystem:AddNode(${varName})`;
    return src;
}
