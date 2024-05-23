import type { AddPosition } from "API/Nodes/Initialize/AddPosition";
import type { Src } from "API/VFXScriptCreator";

export function AutoGenAddPosition(node: AddPosition, src: Src) {
    const className = `AddPosition${node.id}`;
    const varName = `addPosition${node.id}`;

    src.value += `local ${className} = TS.import(script, APIFolder, "Nodes", "Initialize", "AddPosition").AddPosition \n`;
    src.value += `local ${varName} = ${className}.new() \n\n`;

    node.nodeFields.position.AutoGenerateField(`${varName}.nodeFields.position`, src);

    src.value += "\n";
    src.value += `nodeSystem:AddNode(${varName})`;
}
