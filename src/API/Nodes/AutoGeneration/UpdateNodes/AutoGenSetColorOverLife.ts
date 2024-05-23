import type { SetColorOverLife } from "API/Nodes/Update/SetColorOverLife";
import type { Src } from "API/VFXScriptCreator";

export function AutoGenSetColorOverLife(node: SetColorOverLife, src: Src) {
    const className = `SetColorOverLife${node.id}`;
    const varName = `setColorOverLife${node.id}`;

    src.value += `local ${className} = TS.import(script, APIFolder, "Nodes", "Update", "SetColorOverLife").SetColorOverLife \n`;
    src.value += `local ${varName} = ${className}.new() \n\n`;

    node.nodeFields.ramp.AutoGenerateField(`${varName}.nodeFields.ramp`, src);

    src.value += "\n";
    src.value += `nodeSystem:AddNode(${varName})`;
}
