import { Drag } from "API/Nodes/Update/Drag";

export function AutoGenDrag(node: Drag) {
    const className = `Drag${node.id}`;
    const varName = `drag${node.id}`;

    let src = `local ${className} = TS.import(script, APIFolder, "Nodes", "Update", "Drag").Drag \n`;
    src += `local ${varName} = ${className}.new() \n`;

    src += node.nodeFields.drag.AutoGenerateField(`${varName}.nodeFields.drag`);

    src += `nodeSystem:AddNode(${varName})`;
    return src;
}
