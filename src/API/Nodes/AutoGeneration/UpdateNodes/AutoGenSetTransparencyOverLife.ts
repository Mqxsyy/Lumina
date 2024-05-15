import { SetTransparencyOverLife } from "API/Nodes/Update/SetTransparencyOverLife";

export function AutoGenTransparencyOverLife(node: SetTransparencyOverLife) {
    const className = `SetTransparencyOverLife${node.id}`;
    const varName = `transparencyOverLife${node.id}`;

    let src = `local ${className} = TS.import(script, APIFolder, "Nodes", "Update", "SetTransparencyOverLife").SetTransparencyOverLife \n`;
    src += `local ${varName} = ${className}.new() \n`;

    src += node.nodeFields.graph.AutoGenerateField(`${varName}.nodeFields.graph`);

    src += `nodeSystem:AddNode(${varName})`;
    return src;
}
