import { SetSize } from "API/Nodes/Initialize/SetSize";

export function AutoGenSetSize(node: SetSize) {
    const className = `SetSize${node.id}`;
    const varName = `setSize${node.id}`;

    let src = `local ${className} = TS.import(script, APIFolder, "Nodes", "Initialize", "SetSize").SetSize \n`;
    src += `local ${varName} = ${className}.new() \n`;

    if (node.nodeFields.size.boundNode !== undefined) {
        src += "\n";
        src += node.nodeFields.size.boundNode.GetAutoGenerationCode(`${varName}.nodeFields.size.BindNumber(..)`);
        src += "\n";
    } else {
        src += `${varName}.nodeFields.size.SetNumber(${node.nodeFields.size.GetNumber()}) \n`;
    }

    src += `nodeSystem:AddNode(${varName})`;
    return src;
}
