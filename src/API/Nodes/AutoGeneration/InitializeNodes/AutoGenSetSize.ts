import type { SetSize } from "API/Nodes/Initialize/SetSize";

export function AutoGenSetSize(node: SetSize) {
    const className = `SetSize${node.id}`;
    const varName = `setSize${node.id}`;

    let src = `local ${className} = TS.import(script, APIFolder, "Nodes", "Initialize", "SetSize").SetSize \n`;
    src += `local ${varName} = ${className}.new() \n`;

    src += node.nodeFields.size.AutoGenerateField(`${varName}.nodeFields.size`);

    src += `nodeSystem:AddNode(${varName})`;
    return src;
}
