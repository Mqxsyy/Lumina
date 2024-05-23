import type { SetLifetimeRandom } from "API/Nodes/Initialize/SetLifetimeRandom";
import type { Src } from "API/VFXScriptCreator";

export function AutoGenSetLifetimeRandom(node: SetLifetimeRandom, src: Src) {
    const className = `SetLifetimeRandom${node.id}`;
    const varName = `setLifetimeRandom${node.id}`;

    src.value += `local ${className} = TS.import(script, APIFolder, "Nodes", "Initialize", "SetLifetimeRandom").SetLifetimeRandom \n`;
    src.value += `local ${varName} = ${className}.new() \n\n`;

    node.nodeFields.range.AutoGenerateField(`${varName}.nodeFields.range`, src);

    src.value += "\n";
    src.value += `nodeSystem:AddNode(${varName})`;
}
