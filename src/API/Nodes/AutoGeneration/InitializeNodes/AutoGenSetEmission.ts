import type { SetEmission } from "API/Nodes/Initialize/SetEmission";
import type { Src } from "API/VFXScriptCreator";

export function AutoGenSetEmission(node: SetEmission, src: Src) {
    const className = `SetEmission${node.id}`;
    const varName = `setEmission${node.id}`;

    src.value += `local ${className} = TS.import(script, APIFolder, "Nodes", "Initialize", "SetEmission").SetEmission \n`;
    src.value += `local ${varName} = ${className}.new() \n\n`;

    node.nodeFields.emission.AutoGenerateField(`${varName}.nodeFields.emission`, src);

    src.value += "\n";
    src.value += `nodeSystem:AddNode(${varName})`;
}
