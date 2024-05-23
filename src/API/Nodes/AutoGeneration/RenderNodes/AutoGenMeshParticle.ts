import type { MeshParticle } from "API/Nodes/Render/MeshParticle";
import type { Src } from "API/VFXScriptCreator";

export function AutoGenMeshParticle(node: MeshParticle, src: Src) {
    const className = `MeshParticle${node.id}`;
    const varName = `meshParticle${node.id}`;

    src.value += `local ${className} = TS.import(script, APIFolder, "Nodes", "Render", "MeshParticle").MeshParticle \n`;
    src.value += `local ${varName} = ${className}.new() \n\n`;

    node.nodeFields.meshId.AutoGenerateField(`${varName}.nodeFields.meshId`, src);
    node.nodeFields.textureId.AutoGenerateField(`${varName}.nodeFields.textureId`, src);
    node.nodeFields.textureSize.AutoGenerateField(`${varName}.nodeFields.textureSize`, src);
    node.nodeFields.spriteSheetRows.AutoGenerateField(`${varName}.nodeFields.spriteSheetRows`, src);
    node.nodeFields.spriteSheetColumns.AutoGenerateField(`${varName}.nodeFields.spriteSheetColumns`, src);
    node.nodeFields.spriteSheetFrameCount.AutoGenerateField(`${varName}.nodeFields.spriteSheetFrameCount`, src);

    src.value += "\n";
    src.value += `nodeSystem:AddNode(${varName})`;
}
