import { SetRotationZRandom } from "API/Nodes/Initialize/SetRotationZRandom";

export function AutoGenSetRotationZRandom(node: SetRotationZRandom) {
    const className = `SetRotationZRandom${node.id}`;
    const varName = `setRotationZRandom${node.id}`;

    let src = `local ${className} = TS.import(script, APIFolder, "Nodes", "Initialize", "SetRotationZRandom").SetRotationZRandom \n`;
    src += `local ${varName} = ${className}.new() \n`;

    src += node.nodeFields.range.AutoGenerateField(`${varName}.nodeFields.range`);

    src += `nodeSystem:AddNode(${varName})`;
    return src;
}
