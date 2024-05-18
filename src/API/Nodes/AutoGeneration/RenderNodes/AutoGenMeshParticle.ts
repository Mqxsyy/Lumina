import { MeshParticle } from "API/Nodes/Render/MeshParticle";

export function AutoGenMeshParticle(node: MeshParticle) {
    const className = `MeshParticle${node.id}`;
    const varName = `meshParticle${node.id}`;

    let src = `local ${className} = TS.import(script, APIFolder, "Nodes", "Render", "MeshParticle").MeshParticle \n`;
    src += `local ${varName} = ${className}.new() \n`;

    src += node.nodeFields.meshId.AutoGenerateField(`${varName}.nodeFields.meshId`);
    src += node.nodeFields.textureId.AutoGenerateField(`${varName}.nodeFields.textureId`);
    src += node.nodeFields.textureSize.AutoGenerateField(`${varName}.nodeFields.textureSize`);
    src += node.nodeFields.spriteSheetRows.AutoGenerateField(`${varName}.nodeFields.spriteSheetRows`);
    src += node.nodeFields.spriteSheetColumns.AutoGenerateField(`${varName}.nodeFields.spriteSheetColumns`);
    src += node.nodeFields.spriteSheetFrameCount.AutoGenerateField(`${varName}.nodeFields.spriteSheetFrameCount`);

    src += `nodeSystem:AddNode(${varName})`;
    return src;
}
