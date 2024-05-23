import type { SetSizeRandom } from "API/Nodes/Initialize/SetSizeRandom";
import type { Src } from "API/VFXScriptCreator";

export function AutoGenSetSizeRandom(node: SetSizeRandom, src: Src) {
    const className = `SetSizeRandom${node.id}`;
    const varName = `setSizeRandom${node.id}`;

    src.value += `local ${className} = TS.import(script, APIFolder, "Nodes", "Initialize", "SetSizeRandom").SetSizeRandom \n`;
    src.value += `local ${varName} = ${className}.new() \n\n`;

    node.nodeFields.range.AutoGenerateField(`${varName}.nodeFields.range`, src);

    src.value += "\n";
    src.value += `nodeSystem:AddNode(${varName})`;
}
