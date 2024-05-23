import type { SetPosition } from "API/Nodes/Initialize/SetPosition";
import type { Src } from "API/VFXScriptCreator";

export function AutoGenSetPosition(node: SetPosition, src: Src) {
    const className = `SetPosition${node.id}`;
    const varName = `setPosition${node.id}`;

    src.value += `local ${className} = TS.import(script, APIFolder, "Nodes", "Initialize", "SetPosition").SetPosition \n`;
    src.value += `local ${varName} = ${className}.new() \n\n`;

    node.nodeFields.position.AutoGenerateField(`${varName}.nodeFields.position`, src);

    src.value += "\n";
    src.value += `nodeSystem:AddNode(${varName})`;
}
