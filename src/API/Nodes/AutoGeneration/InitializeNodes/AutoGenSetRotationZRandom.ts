import type { SetRotationZRandom } from "API/Nodes/Initialize/SetRotationZRandom";
import type { Src } from "API/VFXScriptCreator";

export function AutoGenSetRotationZRandom(node: SetRotationZRandom, src: Src) {
    const className = `SetRotationZRandom${node.id}`;
    const varName = `setRotationZRandom${node.id}`;

    src.value += `local ${className} = TS.import(script, APIFolder, "Nodes", "Initialize", "SetRotationZRandom").SetRotationZRandom \n`;
    src.value += `local ${varName} = ${className}.new() \n\n`;

    node.nodeFields.range.AutoGenerateField(`${varName}.nodeFields.range`, src);

    src.value += "\n";
    src.value += `nodeSystem:AddNode(${varName})`;
}
