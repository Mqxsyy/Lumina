import { SetLifetime } from "API/Nodes/Initialize/SetLifetime";

export function AutoGenSetLifetime(node: SetLifetime) {
    const className = `SetLifetime${node.id}`;
    const varName = `setLifetime${node.id}`;

    let src = `local ${className} = TS.import(script, APIFolder, "Nodes", "Initialize", "SetLifetime").SetLifetime \n`;
    src += `local ${varName} = ${className}.new() \n`;

    if (node.nodeFields.time.boundNode !== undefined) {
        src += "\n";
        src += node.nodeFields.time.boundNode.GetAutoGenerationCode(`${varName}.nodeFields.time.BindNumber(..)`);
        src += "\n";
    } else {
        src += `${varName}.nodeFields.time.SetNumber(${node.nodeFields.time.GetNumber()}) \n`;
    }

    src += `nodeSystem:AddNode(${varName})`;
    return src;
}
