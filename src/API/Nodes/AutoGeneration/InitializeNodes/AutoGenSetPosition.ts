import type { SetPosition } from "API/Nodes/Initialize/SetPosition";

export function AutoGenSetPosition(node: SetPosition) {
    const className = `SetPosition${node.id}`;
    const varName = `setPosition${node.id}`;

    let src = `local ${className} = TS.import(script, APIFolder, "Nodes", "Initialize", "SetPosition").SetPosition \n`;
    src += `local ${varName} = ${className}.new() \n`;

    src += node.nodeFields.position.AutoGenerateField(`${varName}.nodeFields.position`);

    src += `nodeSystem:AddNode(${varName})`;
    return src;
}
