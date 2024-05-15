import { SetSizeOverLife } from "API/Nodes/Update/SetSizeOverLife";

export function AutoGenSetSizeOverLife(node: SetSizeOverLife) {
    const className = `SetSizeOverLife${node.id}`;
    const varName = `multiplySizeOverLife${node.id}`;

    let src = `local ${className} = TS.import(script, APIFolder, "Nodes", "Update", "SetSizeOverLife").SetSizeOverLife \n`;
    src += `local ${varName} = ${className}.new() \n`;

    src += node.nodeFields.graph.AutoGenerateField(`${varName}.nodeFields.graph`);

    src += `nodeSystem:AddNode(${varName})`;
    return src;
}
