import type { MultiplySizeOverLife } from "API/Nodes/Update/MultiplySizeOverLife";
import type { Src } from "API/VFXScriptCreator";

export function AutoGenMultiplySizeOverLife(node: MultiplySizeOverLife, src: Src) {
    const className = `MultiplySizeOverLife${node.id}`;
    const varName = `multiplySizeOverLife${node.id}`;

    src.value += `local ${className} = TS.import(script, APIFolder, "Nodes", "Update", "MultiplySizeOverLife").MultiplySizeOverLife \n`;
    src.value += `local ${varName} = ${className}.new() \n\n`;

    node.nodeFields.graph.AutoGenerateField(`${varName}.nodeFields.graph`, src);

    src.value += "\n";
    src.value += `nodeSystem:AddNode(${varName})`;
}
