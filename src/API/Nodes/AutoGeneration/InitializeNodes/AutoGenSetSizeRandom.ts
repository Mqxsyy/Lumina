import type { SetSizeRandom } from "API/Nodes/Initialize/SetSizeRandom";

export function AutoGenSetSizeRandom(node: SetSizeRandom) {
    const className = `SetSizeRandom${node.id}`;
    const varName = `setSizeRandom${node.id}`;

    let src = `local ${className} = TS.import(script, APIFolder, "Nodes", "Initialize", "SetSizeRandom").SetSizeRandom \n`;
    src += `local ${varName} = ${className}.new() \n`;

    src += node.nodeFields.range.AutoGenerateField(`${varName}.nodeFields.range`);

    src += `nodeSystem:AddNode(${varName})`;
    return src;
}
