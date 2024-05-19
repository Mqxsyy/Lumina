import type { SetColorOverLife } from "API/Nodes/Update/SetColorOverLife";

export function AutoGenSetColorOverLife(node: SetColorOverLife) {
    const className = `SetColorOverLife${node.id}`;
    const varName = `setColorOverLife${node.id}`;

    let src = `local ${className} = TS.import(script, APIFolder, "Nodes", "Update", "SetColorOverLife").SetColorOverLife \n`;
    src += `local ${varName} = ${className}.new() \n`;

    src += node.nodeFields.ramp.AutoGenerateField(`${varName}.nodeFields.ramp`);

    src += `nodeSystem:AddNode(${varName})`;
    return src;
}
