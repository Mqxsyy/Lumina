import { VolumetricParticle } from "API/Nodes/Render/VolumetricParticle";

export function AutoGenVolumetricParticle(node: VolumetricParticle) {
    const className = `VolumetricParticle${node.id}`;
    const varName = `volumetricParticle${node.id}`;

    let src = `local ${className} = TS.import(script, APIFolder, "Nodes", "Render", "VolumetricParticle").VolumetricParticle \n`;
    src += `local ${varName} = ${className}.new() \n`;

    src += node.nodeFields.shape.AutoGenerateField(`${varName}.nodeFields.shape`);

    src += `nodeSystem:AddNode(${varName})`;
    return src;
}
