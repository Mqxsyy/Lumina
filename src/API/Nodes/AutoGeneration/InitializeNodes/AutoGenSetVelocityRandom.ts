import { SetVelocityRandom } from "API/Nodes/Initialize/SetVelocityRandom";

export function AutoGenSetVelocityRandom(node: SetVelocityRandom) {
    const className = `SetVelocityRandom${node.id}`;
    const varName = `setVelocityRandom${node.id}`;

    let src = `local ${className} = TS.import(script, APIFolder, "Nodes", "Initialize", "SetVelocityRandom").SetVelocityRandom \n`;
    src += `local ${varName} = ${className}.new() \n`;

    src += node.nodeFields.rangeX.AutoGenerateField(`${varName}.nodeFields.rangeX`);
    src += node.nodeFields.rangeY.AutoGenerateField(`${varName}.nodeFields.rangeY`);
    src += node.nodeFields.rangeZ.AutoGenerateField(`${varName}.nodeFields.rangeZ`);

    src += `nodeSystem:AddNode(${varName})`;
    return src;
}
