import { SetVelocityRandom } from "API/Nodes/Initialize/SetVelocityRandom";

export function AutoGenSetVelocityRandom(node: SetVelocityRandom) {
    const className = `SetVelocityRandom${node.id}`;
    const varName = `setVelocityRandom${node.id}`;

    let src = `local ${className} = TS.import(script, APIFolder, "Nodes", "Initialize", "SetVelocityRandom").SetVelocityRandom \n`;
    src += `local ${varName} = ${className}.new() \n`;
    const rangeX = node.nodeFields.rangeX.GetVector2();
    const rangeY = node.nodeFields.rangeY.GetVector2();
    const rangeZ = node.nodeFields.rangeZ.GetVector2();
    src += `${varName}.nodeFields.rangeX.SetVector2(${rangeX.x}, ${rangeX.y}) \n`;
    src += `${varName}.nodeFields.rangeY.SetVector2(${rangeY.x}, ${rangeY.y}) \n`;
    src += `${varName}.nodeFields.rangeZ.SetVector2(${rangeZ.x}, ${rangeZ.y}) \n`;
    src += `nodeSystem:AddNode(${varName})`;

    return src;
}
