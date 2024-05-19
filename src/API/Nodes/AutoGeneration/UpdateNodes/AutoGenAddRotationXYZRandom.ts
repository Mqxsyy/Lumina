import type { AddRotationXYZRandom } from "API/Nodes/Update/AddRotationXYZRandom";

export function AutoGenAddRotationXYZRandom(node: AddRotationXYZRandom) {
    const className = `AddRotationXYZRandom${node.id}`;
    const varName = `addRotationXYZRandom${node.id}`;

    let src = `local ${className} = TS.import(script, APIFolder, "Nodes", "Update", "AddRotationXYZRandom").AddRotationXYZRandom \n`;
    src += `local ${varName} = ${className}.new() \n`;

    src += node.nodeFields.rangeX.AutoGenerateField(`${varName}.nodeFields.rangeX`);
    src += node.nodeFields.rangeY.AutoGenerateField(`${varName}.nodeFields.rangeY`);
    src += node.nodeFields.rangeZ.AutoGenerateField(`${varName}.nodeFields.rangeZ`);

    src += `nodeSystem:AddNode(${varName})`;
    return src;
}
