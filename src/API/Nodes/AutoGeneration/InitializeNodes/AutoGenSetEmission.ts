import type { SetEmission } from "API/Nodes/Initialize/SetEmission";

export function AutoGenSetEmission(node: SetEmission) {
    const className = `SetEmission${node.id}`;
    const varName = `setEmission${node.id}`;

    let src = `local ${className} = TS.import(script, APIFolder, "Nodes", "Initialize", "SetEmission").SetEmission \n`;
    src += `local ${varName} = ${className}.new() \n`;

    src += node.nodeFields.emission.AutoGenerateField(`${varName}.nodeFields.emission`);

    src += `nodeSystem:AddNode(${varName})`;
    return src;
}
