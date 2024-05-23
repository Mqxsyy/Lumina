import type { ConstantSpawn } from "API/Nodes/Spawn/ConstantSpawn";
import type { Src } from "API/VFXScriptCreator";

export function AutoGenConstantSpawn(node: ConstantSpawn, src: Src) {
    const className = `ConstantSpawn${node.id}`;
    const varName = `constantSpawn${node.id}`;

    src.value += `local ${className} = TS.import(script, APIFolder, "Nodes", "Spawn", "ConstantSpawn").ConstantSpawn \n`;
    src.value += `local ${varName} = ${className}.new() \n\n`;

    node.nodeFields.rate.AutoGenerateField(`${varName}.nodeFields.rate`, src);

    src.value += "\n";
    src.value += `nodeSystem:AddNode(${varName})`;
}
