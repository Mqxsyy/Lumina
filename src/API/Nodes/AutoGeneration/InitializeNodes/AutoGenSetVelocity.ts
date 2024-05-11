import { SetVelocity } from "API/Nodes/Initialize/SetVelocity";

export function AutoGenSetVelocity(node: SetVelocity) {
    const className = `SetVelocity${node.id}`;
    const varName = `setVelocity${node.id}`;

    let src = `local ${className} = TS.import(script, APIFolder, "Nodes", "Initialize", "SetVelocity").SetVelocity \n`;
    src += `local ${varName} = ${className}.new() \n`;

    if (node.nodeFields.velocity.boundNodeX !== undefined) {
        src += "\n";
        src += node.nodeFields.velocity.boundNodeX.GetAutoGenerationCode(`${varName}.nodeFields.velocity.BindX(..)`);
        src += "\n";
    } else {
        src += `${varName}.nodeFields.velocity.SetX(${node.nodeFields.velocity.x}) \n`;
    }

    if (node.nodeFields.velocity.boundNodeY !== undefined) {
        src += "\n";
        src += node.nodeFields.velocity.boundNodeY.GetAutoGenerationCode(`${varName}.nodeFields.velocity.BindY(..)`);
        src += "\n";
    } else {
        src += `${varName}.nodeFields.velocity.SetY(${node.nodeFields.velocity.y}) \n`;
    }

    if (node.nodeFields.velocity.boundNodeZ !== undefined) {
        src += "\n";
        src += node.nodeFields.velocity.boundNodeZ.GetAutoGenerationCode(`${varName}.nodeFields.velocity.BindZ(..)`);
        src += "\n";
    } else {
        src += `${varName}.nodeFields.velocity.SetZ(${node.nodeFields.velocity.z}) \n`;
    }

    src += `nodeSystem:AddNode(${varName})`;
    return src;
}
