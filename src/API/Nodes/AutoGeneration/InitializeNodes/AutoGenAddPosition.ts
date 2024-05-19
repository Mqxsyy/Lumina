import type { AddPosition } from "API/Nodes/Initialize/AddPosition";

export function AutoGenAddPosition(node: AddPosition) {
    const className = `AddPosition${node.id}`;
    const varName = `addPosition${node.id}`;

    let src = `local ${className} = TS.import(script, APIFolder, "Nodes", "Initialize", "AddPosition").AddPosition \n`;
    src += `local ${varName} = ${className}.new() \n`;

    src += node.nodeFields.position.AutoGenerateField(`${varName}.nodeFields.position`);

    src += `nodeSystem:AddNode(${varName})`;
    return src;
}
