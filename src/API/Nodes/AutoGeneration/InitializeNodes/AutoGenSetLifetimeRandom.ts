import { SetLifetimeRandom } from "API/Nodes/Initialize/SetLifetimeRandom";

export function AutoGenSetLifetimeRandom(node: SetLifetimeRandom) {
    const className = `SetLifetimeRandom${node.id}`;
    const varName = `setLifetimeRandom${node.id}`;

    let src = `local ${className} = TS.import(script, APIFolder, "Nodes", "Initialize", "SetLifetimeRandom").SetLifetimeRandom \n`;
    src += `local ${varName} = ${className}.new() \n`;

    src += node.nodeFields.range.AutoGenerateField(`${varName}.nodeFields.range`);

    src += `nodeSystem:AddNode(${varName})`;
    return src;
}
