import type { SetColor } from "API/Nodes/Initialize/SetColor";
import type { Src } from "API/VFXScriptCreator";

export function AutoGenSetColor(node: SetColor, src: Src) {
    const className = `SetColor${node.id}`;
    const varName = `setColor${node.id}`;

    src.value += `local ${className} = TS.import(script, APIFolder, "Nodes", "Initialize", "SetColor").SetColor \n`;
    src.value += `local ${varName} = ${className}.new() \n\n`;

    node.nodeFields.color.AutoGenerateField(`${varName}.nodeFields.color`, src);

    src.value += "\n";
    src.value += `nodeSystem:AddNode(${varName})`;
}
