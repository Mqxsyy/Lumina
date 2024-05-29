import type { SetLifetime } from "API/Nodes/Initialize/SetLifetime";
import type { Src } from "API/VFXScriptCreator";

export function AutoGenSetLifetime(node: SetLifetime, src: Src) {
    const className = `SetLifetime${node.id}`;
    const varName = `setLifetime${node.id}`;

    src.value += `local ${className} = TS.import(script, APIFolder, "Nodes", "Initialize", "SetLifetime").SetLifetime \n`;
    src.value += `local ${varName} = ${className}.new() \n\n`;

    node.nodeFields.time.AutoGenerateField(`${varName}.nodeFields.time`, src);

    src.value += "\n";
    src.value += `nodeSystem:AddNode(${varName})`;
}
