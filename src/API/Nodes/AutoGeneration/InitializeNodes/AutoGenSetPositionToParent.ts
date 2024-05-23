import type { SetPositionToParent } from "API/Nodes/Initialize/SetPositionToParent";
import type { Src } from "API/VFXScriptCreator";

export function AutoGenSetPositionToParent(node: SetPositionToParent, src: Src) {
    const className = `SetPositionToParent${node.id}`;
    const varName = `setPositionToParent${node.id}`;

    src.value += `local ${className} = TS.import(script, APIFolder, "Nodes", "Initialize", "SetPositionToParent").SetPositionToParent \n`;
    src.value += `local ${varName} = ${className}.new(script.parent) \n\n`;

    src.value += "\n";
    src.value += `nodeSystem:AddNode(${varName})`;
}
