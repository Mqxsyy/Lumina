import type { AddRotationZRandom } from "API/Nodes/Update/AddRotationZRandom";
import type { Src } from "API/VFXScriptCreator";

export function AutoGenAddRotationZRandom(node: AddRotationZRandom, src: Src) {
    const className = `AddRotationZRandom${node.id}`;
    const varName = `addRotationZRandom${node.id}`;

    src.value += `local ${className} = TS.import(script, APIFolder, "Nodes", "Update", "AddRotationZRandom").AddRotationZRandom \n`;
    src.value += `local ${varName} = ${className}.new() \n\n`;

    node.nodeFields.range.AutoGenerateField(`${varName}.nodeFields.range`, src);

    src.value += "\n";
    src.value += `nodeSystem:AddNode(${varName})`;
}
