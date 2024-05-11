import { SetEmission } from "API/Nodes/Initialize/SetEmission";

export function AutoGenSetEmission(node: SetEmission) {
    const className = `SetEmission${node.id}`;
    const varName = `setColor${node.id}`;

    let src = `local ${className} = TS.import(script, APIFolder, "Nodes", "Initialize", "SetEmission").SetEmission \n`;
    src += `local ${varName} = ${className}.new() \n`;

    if (node.nodeFields.emission.boundNode !== undefined) {
        src += "\n";
        src += node.nodeFields.emission.boundNode.GetAutoGenerationCode(
            `${varName}.nodeFields.emission.BindNumber(..)`,
        );
        src += "\n";
    } else {
        src += `${varName}.nodeFields.emission.SetNumber(${node.nodeFields.emission.GetNumber()}) \n`;
    }

    src += `nodeSystem:AddNode(${varName})`;

    return src;
}
