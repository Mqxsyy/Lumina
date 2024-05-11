import { Accelerate } from "API/Nodes/Update/Accelerate";

export function AutoGenAccelerate(node: Accelerate) {
    const className = `Acceleration${node.id}`;
    const varName = `Acceleration${node.id}`;

    let src = `local ${className} = TS.import(script, APIFolder, "Nodes", "Update", "Acceleration").Acceleration \n`;
    src += `local ${varName} = ${className}.new() \n`;

    if (node.nodeFields.acceleration.boundNode !== undefined) {
        src += "\n";
        src += node.nodeFields.acceleration.boundNode.GetAutoGenerationCode(
            `${varName}.nodeFields.acceleration.BindNumber(..)`,
        );
        src += "\n";
    } else {
        src += `${varName}.nodeFields.acceleration.SetNumber(${node.nodeFields.acceleration.GetNumber()}) \n`;
    }

    src += `nodeSystem:AddNode(${varName})`;
    return src;
}
