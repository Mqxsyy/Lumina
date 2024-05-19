import type { MultiplyVelocityOverLife } from "API/Nodes/Update/MultiplyVelocityOverLife";

export function AutoGenMultiplyVelocityOverLife(node: MultiplyVelocityOverLife) {
    const className = `MultiplyVelocityOverLife${node.id}`;
    const varName = `multiplyVelocityOverLife${node.id}`;

    let src = `local ${className} = TS.import(script, APIFolder, "Nodes", "Update", "MultiplyVelocityOverLife").MultiplyVelocityOverLife \n`;
    src += `local ${varName} = ${className}.new() \n`;

    src += node.nodeFields.graph.AutoGenerateField(`${varName}.nodeFields.graph`);

    src += `nodeSystem:AddNode(${varName})`;
    return src;
}
