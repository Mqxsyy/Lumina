import type { PlaneParticle } from "API/Nodes/Render/PlaneParticle";
import type { Src } from "API/VFXScriptCreator";

export function AutoGenPlaneParticle(node: PlaneParticle, src: Src) {
    const className = `PlaneParticle${node.id}`;
    const varName = `planeParticle${node.id}`;

    src.value += `local ${className} = TS.import(script, APIFolder, "Nodes", "Render", "PlaneParticle").PlaneParticle \n`;
    src.value += `local ${varName} = ${className}.new() \n\n`;

    node.nodeFields.orientation.AutoGenerateField(`${varName}.nodeFields.orientation`, src);
    node.nodeFields.assetId.AutoGenerateField(`${varName}.nodeFields.assetId`, src);
    node.nodeFields.doubleSided.AutoGenerateField(`${varName}.nodeFields.doubleSided`, src);
    node.nodeFields.imageSize.AutoGenerateField(`${varName}.nodeFields.imageSize`, src);
    node.nodeFields.spriteSheetRows.AutoGenerateField(`${varName}.nodeFields.spriteSheetRows`, src);
    node.nodeFields.spriteSheetColumns.AutoGenerateField(`${varName}.nodeFields.spriteSheetColumns`, src);
    node.nodeFields.spriteSheetFrameCount.AutoGenerateField(`${varName}.nodeFields.spriteSheetFrameCount`, src);

    src.value += "\n";
    src.value += `nodeSystem:AddNode(${varName})`;
}
