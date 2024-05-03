import { ParticlePlane } from "API/Nodes/Render/ParticlePlane";

export function AutogenParticlePlane(node: ParticlePlane) {
    const className = `Lifetime${node.id}`;
    const varName = `lifetime${node.id}`;

    let src = `local ${className} = TS.import(script, APIFolder, "Nodes", "Render", "ParticlePlane").ParticlePlane \n`;
    src += `local ${varName} = ${className}.new() \n`;

    src += `${varName}.nodeFields.orientation.SetOrientation(${node.nodeFields.orientation.GetOrientation()}) \n`;
    src += `${varName}.nodeFields.assetId.SetNumber(${node.nodeFields.assetId.GetNumber()}) \n`;
    src += `${varName}.nodeFields.imageSize.SetVector2(${node.nodeFields.imageSize.GetX()}, ${node.nodeFields.imageSize.GetY()}) \n`;
    src += `${varName}.nodeFields.spriteSheetRows.SetNumber(${node.nodeFields.spriteSheetRows.GetNumber()}) \n`;
    src += `${varName}.nodeFields.spriteSheetColumns.SetNumber(${node.nodeFields.spriteSheetColumns.GetNumber()}) \n`;
    src += `${varName}.nodeFields.spriteSheetFrameCount.SetNumber(${node.nodeFields.spriteSheetFrameCount.GetNumber()}) \n`;

    src += `nodeSystem:AddNode(${varName})`;

    return src;
}
