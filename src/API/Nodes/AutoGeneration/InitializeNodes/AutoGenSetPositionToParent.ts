import { SetPositionToParent } from "API/Nodes/Initialize/SetPositionToParent";

export function AutoGenSetPositionToParent(node: SetPositionToParent) {
    const className = `SetPositionToParent${node.id}`;
    const varName = `SetPositionToParent${node.id}`;

    let src = `local ${className} = TS.import(script, APIFolder, "Nodes", "Initialize", "SetPositionToParent").SetPositionToParent \n`;
    src += `local ${varName} = ${className}.new(script.parent) \n`;
    src += `nodeSystem:AddNode(${varName})`;
    return src;
}
