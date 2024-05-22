import type { AddPositionFromShape } from "API/Nodes/Initialize/AddPositionFromShape";

export function AutoGenAddPositionFromShape(node: AddPositionFromShape) {
    const className = `AddPositionFromShape${node.id}`;
    const varName = `addPositionFromShape${node.id}`;

    let src = `local ${className} = TS.import(script, APIFolder, "Nodes", "Initialize", "AddPositionFromShape").AddPositionFromShape \n`;
    src += `local ${varName} = ${className}.new() \n`;

    src += node.nodeFields.spawnShape.AutoGenerateField(`${varName}.nodeFields.spawnShape`);
    src += node.nodeFields.sizeVec2.AutoGenerateField(`${varName}.nodeFields.sizeVec2`);
    src += node.nodeFields.sizeVec3.AutoGenerateField(`${varName}.nodeFields.sizeVec3`);
    src += node.nodeFields.filled.AutoGenerateField(`${varName}.nodeFields.filled`);
    src += node.nodeFields.edgeWidth.AutoGenerateField(`${varName}.nodeFields.edgeWidth`);
    src += node.nodeFields.rotation.AutoGenerateField(`${varName}.nodeFields.rotation`);

    src += `nodeSystem:AddNode(${varName})`;
    return src;
}
