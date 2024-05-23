import type { SetTransparencyOverLife } from "API/Nodes/Update/SetTransparencyOverLife";
import type { Src } from "API/VFXScriptCreator";

export function AutoGenTransparencyOverLife(node: SetTransparencyOverLife, src: Src) {
    const className = `SetTransparencyOverLife${node.id}`;
    const varName = `transparencyOverLife${node.id}`;

    src.value += `local ${className} = TS.import(script, APIFolder, "Nodes", "Update", "SetTransparencyOverLife").SetTransparencyOverLife \n`;
    src.value += `local ${varName} = ${className}.new() \n\n`;

    node.nodeFields.graph.AutoGenerateField(`${varName}.nodeFields.graph`, src);

    src.value += "\n";
    src.value += `nodeSystem:AddNode(${varName})`;
}
