import type { SetSize } from "API/Nodes/Initialize/SetSize";
import type { Src } from "API/VFXScriptCreator";

export function AutoGenSetSize(node: SetSize, src: Src) {
    const className = `SetSize${node.id}`;
    const varName = `setSize${node.id}`;

    src.value += `local ${className} = TS.import(script, APIFolder, "Nodes", "Initialize", "SetSize").SetSize \n`;
    src.value += `local ${varName} = ${className}.new() \n\n`;

    node.nodeFields.size.AutoGenerateField(`${varName}.nodeFields.size`, src);

    src.value += "\n";
    src.value += `nodeSystem:AddNode(${varName})`;
}
