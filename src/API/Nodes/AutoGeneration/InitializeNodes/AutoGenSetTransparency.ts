import { SetTransparency } from "API/Nodes/Initialize/SetTransparency";

export function AutoGenSetTransparency(node: SetTransparency) {
    const className = `SetTransparency${node.id}`;
    const varName = `setTransparency${node.id}`;

    let src = `local ${className} = TS.import(script, APIFolder, "Nodes", "Initialize", "SetTransparency").SetTransparency \n`;
    src += `local ${varName} = ${className}.new() \n`;

    src += node.nodeFields.transparency.AutoGenerateField(`${varName}.nodeFields.transparency`);

    src += `nodeSystem:AddNode(${varName})`;
    return src;
}
