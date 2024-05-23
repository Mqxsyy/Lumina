import type { SetTransparency } from "API/Nodes/Initialize/SetTransparency";
import type { Src } from "API/VFXScriptCreator";

export function AutoGenSetTransparency(node: SetTransparency, src: Src) {
    const className = `SetTransparency${node.id}`;
    const varName = `setTransparency${node.id}`;

    src.value += `local ${className} = TS.import(script, APIFolder, "Nodes", "Initialize", "SetTransparency").SetTransparency \n`;
    src.value += `local ${varName} = ${className}.new() \n\n`;

    node.nodeFields.transparency.AutoGenerateField(`${varName}.nodeFields.transparency`, src);

    src.value += "\n";
    src.value += `nodeSystem:AddNode(${varName})`;
}
