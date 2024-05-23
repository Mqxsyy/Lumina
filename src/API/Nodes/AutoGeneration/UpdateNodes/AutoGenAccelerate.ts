import type { Accelerate } from "API/Nodes/Update/Accelerate";
import type { Src } from "API/VFXScriptCreator";

export function AutoGenAccelerate(node: Accelerate, src: Src) {
    const className = `Acceleration${node.id}`;
    const varName = `acceleration${node.id}`;

    src.value += `local ${className} = TS.import(script, APIFolder, "Nodes", "Update", "Acceleration").Acceleration \n`;
    src.value += `local ${varName} = ${className}.new() \n\n`;

    node.nodeFields.acceleration.AutoGenerateField(`${varName}.nodeFields.acceleration`, src);

    src.value += "\n";
    src.value += `nodeSystem:AddNode(${varName})`;
}
