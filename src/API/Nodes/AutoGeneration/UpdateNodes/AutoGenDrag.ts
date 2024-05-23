import type { Drag } from "API/Nodes/Update/Drag";
import type { Src } from "API/VFXScriptCreator";

export function AutoGenDrag(node: Drag, src: Src) {
    const className = `Drag${node.id}`;
    const varName = `drag${node.id}`;

    src.value += `local ${className} = TS.import(script, APIFolder, "Nodes", "Update", "Drag").Drag \n`;
    src.value += `local ${varName} = ${className}.new() \n\n`;

    node.nodeFields.drag.AutoGenerateField(`${varName}.nodeFields.drag`, src);

    src.value += "\n";
    src.value += `nodeSystem:AddNode(${varName})`;
}
