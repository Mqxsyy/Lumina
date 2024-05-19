import type { MultiplySizeOverLife } from "API/Nodes/Update/MultiplySizeOverLife";

export function AutoGenMultiplySizeOverLife(node: MultiplySizeOverLife) {
    const className = `MultiplySizeOverLife${node.id}`;
    const varName = `multiplySizeOverLife${node.id}`;

    let src = `local ${className} = TS.import(script, APIFolder, "Nodes", "Update", "MultiplySizeOverLife").MultiplySizeOverLife \n`;
    src += `local ${varName} = ${className}.new() \n`;

    src += node.nodeFields.graph.AutoGenerateField(`${varName}.nodeFields.graph`);

    src += `nodeSystem:AddNode(${varName})`;
    return src;
}
