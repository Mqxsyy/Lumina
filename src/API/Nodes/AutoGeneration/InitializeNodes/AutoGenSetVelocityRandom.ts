import type { SetVelocityRandom } from "API/Nodes/Initialize/SetVelocityRandom";
import type { Src } from "API/VFXScriptCreator";

export function AutoGenSetVelocityRandom(node: SetVelocityRandom, src: Src) {
    const className = `SetVelocityRandom${node.id}`;
    const varName = `setVelocityRandom${node.id}`;

    src.value += `local ${className} = TS.import(script, APIFolder, "Nodes", "Initialize", "SetVelocityRandom").SetVelocityRandom \n`;
    src.value += `local ${varName} = ${className}.new() \n\n`;

    node.nodeFields.rangeX.AutoGenerateField(`${varName}.nodeFields.rangeX`, src);
    node.nodeFields.rangeY.AutoGenerateField(`${varName}.nodeFields.rangeY`, src);
    node.nodeFields.rangeZ.AutoGenerateField(`${varName}.nodeFields.rangeZ`, src);

    src.value += "\n";
    src.value += `nodeSystem:AddNode(${varName})`;
}
