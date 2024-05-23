import type { SetSizeOverLife } from "API/Nodes/Update/SetSizeOverLife";
import type { Src } from "API/VFXScriptCreator";

export function AutoGenSetSizeOverLife(node: SetSizeOverLife, src: Src) {
    const className = `SetSizeOverLife${node.id}`;
    const varName = `multiplySizeOverLife${node.id}`;

    src.value += `local ${className} = TS.import(script, APIFolder, "Nodes", "Update", "SetSizeOverLife").SetSizeOverLife \n`;
    src.value += `local ${varName} = ${className}.new() \n\n`;

    node.nodeFields.graph.AutoGenerateField(`${varName}.nodeFields.graph`, src);

    src.value += "\n";
    src.value += `nodeSystem:AddNode(${varName})`;
}
