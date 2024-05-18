import { PlaneParticle } from "API/Nodes/Render/PlaneParticle";

export function AutoGenPlaneParticle(node: PlaneParticle) {
    const className = `PlaneParticle${node.id}`;
    const varName = `planeParticle${node.id}`;

    let src = `local ${className} = TS.import(script, APIFolder, "Nodes", "Render", "PlaneParticle").PlaneParticle \n`;
    src += `local ${varName} = ${className}.new() \n`;

    src += node.nodeFields.orientation.AutoGenerateField(`${varName}.nodeFields.orientation`);
    src += node.nodeFields.assetId.AutoGenerateField(`${varName}.nodeFields.assetId`);
    src += node.nodeFields.doubleSided.AutoGenerateField(`${varName}.nodeFields.doubleSided`);
    src += node.nodeFields.imageSize.AutoGenerateField(`${varName}.nodeFields.imageSize`);
    src += node.nodeFields.spriteSheetRows.AutoGenerateField(`${varName}.nodeFields.spriteSheetRows`);
    src += node.nodeFields.spriteSheetColumns.AutoGenerateField(`${varName}.nodeFields.spriteSheetColumns`);
    src += node.nodeFields.spriteSheetFrameCount.AutoGenerateField(`${varName}.nodeFields.spriteSheetFrameCount`);

    src += `nodeSystem:AddNode(${varName})`;
    return src;
}
