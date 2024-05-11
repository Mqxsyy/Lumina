import { AddPosition } from "API/Nodes/Initialize/AddPosition";

export function AutoGenAddPosition(node: AddPosition) {
    const className = `AddPosition${node.id}`;
    const varName = `AddPosition${node.id}`;

    let src = `local ${className} = TS.import(script, APIFolder, "Nodes", "Initialize", "AddPosition").AddPosition \n`;
    src += `local ${varName} = ${className}.new() \n`;

    if (node.nodeFields.position.boundNodeX !== undefined) {
        src += "\n";
        src += node.nodeFields.position.boundNodeX.GetAutoGenerationCode(`${varName}.nodeFields.position.BindX(..)`);
        src += "\n";
    } else {
        src += `${varName}.nodeFields.position.SetX(${node.nodeFields.position.x}) \n`;
    }

    if (node.nodeFields.position.boundNodeY !== undefined) {
        src += "\n";
        src += node.nodeFields.position.boundNodeY.GetAutoGenerationCode(`${varName}.nodeFields.position.BindY(..)`);
        src += "\n";
    } else {
        src += `${varName}.nodeFields.position.SetY(${node.nodeFields.position.y}) \n`;
    }

    if (node.nodeFields.position.boundNodeZ !== undefined) {
        src += "\n";
        src += node.nodeFields.position.boundNodeZ.GetAutoGenerationCode(`${varName}.nodeFields.position.BindZ(..)`);
        src += "\n";
    } else {
        src += `${varName}.nodeFields.position.SetZ(${node.nodeFields.position.z}) \n`;
    }

    src += `nodeSystem:AddNode(${varName})`;
    return src;
}
