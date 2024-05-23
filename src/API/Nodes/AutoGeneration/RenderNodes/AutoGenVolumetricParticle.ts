import type { VolumetricParticle } from "API/Nodes/Render/VolumetricParticle";
import type { Src } from "API/VFXScriptCreator";

export function AutoGenVolumetricParticle(node: VolumetricParticle, src: Src) {
    const className = `VolumetricParticle${node.id}`;
    const varName = `volumetricParticle${node.id}`;

    src.value += `local ${className} = TS.import(script, APIFolder, "Nodes", "Render", "VolumetricParticle").VolumetricParticle \n`;
    src.value += `local ${varName} = ${className}.new() \n\n`;

    node.nodeFields.shape.AutoGenerateField(`${varName}.nodeFields.shape`, src);

    src.value += "\n";
    src.value += `nodeSystem:AddNode(${varName})`;
}
