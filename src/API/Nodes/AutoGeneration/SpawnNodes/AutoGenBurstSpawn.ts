import type { BurstSpawn } from "API/Nodes/Spawn/BurstSpawn";
import type { Src } from "API/VFXScriptCreator";

export function AutoGenBurstSpawn(node: BurstSpawn, src: Src) {
    const className = `BurstSpawn${node.id}`;
    const varName = `burstSpawn${node.id}`;

    src.value += `local ${className} = TS.import(script, APIFolder, "Nodes", "Spawn", "BurstSpawn").BurstSpawn \n`;
    src.value += `local ${varName} = ${className}.new() \n\n`;

    node.nodeFields.amount.AutoGenerateField(`${varName}.nodeFields.amount`, src);

    src.value += "\n";
    src.value += `nodeSystem:AddNode(${varName})`;
}
