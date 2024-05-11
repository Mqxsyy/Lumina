import { SetTransparency } from "API/Nodes/Initialize/SetTransparency";

export function AutoGenSetTransparency(node: SetTransparency) {
    const className = `SetTransparency${node.id}`;
    const varName = `setTransparency${node.id}`;

    let src = `local ${className} = TS.import(script, APIFolder, "Nodes", "Initialize", "SetTransparency").SetTransparency \n`;
    src += `local ${varName} = ${className}.new() \n`;

    if (node.nodeFields.transparency.boundNode !== undefined) {
        src += "\n";
        src += node.nodeFields.transparency.boundNode.GetAutoGenerationCode(
            `${varName}.nodeFields.transparency.BindNumber(..)`,
        );
        src += "\n";
    } else {
        src += `${varName}.nodeFields.transparency.SetNumber(${node.nodeFields.transparency.GetNumber()}) \n`;
    }

    src += `nodeSystem:AddNode(${varName})`;
    return src;
}
