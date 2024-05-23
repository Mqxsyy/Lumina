import type { AddRotationXYZRandom } from "API/Nodes/Update/AddRotationXYZRandom";
import type { Src } from "API/VFXScriptCreator";

export function AutoGenAddRotationXYZRandom(node: AddRotationXYZRandom, src: Src) {
    const className = `AddRotationXYZRandom${node.id}`;
    const varName = `addRotationXYZRandom${node.id}`;

    src.value += `local ${className} = TS.import(script, APIFolder, "Nodes", "Update", "AddRotationXYZRandom").AddRotationXYZRandom \n`;
    src.value += `local ${varName} = ${className}.new() \n\n`;

    node.nodeFields.rangeX.AutoGenerateField(`${varName}.nodeFields.rangeX`, src);
    node.nodeFields.rangeY.AutoGenerateField(`${varName}.nodeFields.rangeY`, src);
    node.nodeFields.rangeZ.AutoGenerateField(`${varName}.nodeFields.rangeZ`, src);

    src.value += "\n";
    src.value += `nodeSystem:AddNode(${varName})`;
}
