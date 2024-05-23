import type { SetVelocity } from "API/Nodes/Initialize/SetVelocity";
import type { Src } from "API/VFXScriptCreator";

export function AutoGenSetVelocity(node: SetVelocity, src: Src) {
    const className = `SetVelocity${node.id}`;
    const varName = `setVelocity${node.id}`;

    src.value = `local ${className} = TS.import(script, APIFolder, "Nodes", "Initialize", "SetVelocity").SetVelocity \n`;
    src.value += `local ${varName} = ${className}.new() \n\n`;

    node.nodeFields.velocity.AutoGenerateField(`${varName}.nodeFields.velocity`, src);

    src.value += "\n";
    src.value += `nodeSystem:AddNode(${varName})`;
}
