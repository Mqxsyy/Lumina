import { SetVelocityRandom } from "API/Nodes/Initialize/SetVelocityRandom";

export function AutoGenSetVelocityRandom(node: SetVelocityRandom) {
    const className = `SetVelocityRandom${node.id}`;
    const varName = `setVelocityRandom${node.id}`;

    let src = `local ${className} = TS.import(script, APIFolder, "Nodes", "Initialize", "SetVelocityRandom").SetVelocityRandom \n`;
    src += `local ${varName} = ${className}.new() \n`;

    if (node.nodeFields.rangeX.boundNodeX !== undefined) {
        src += "\n";
        src += node.nodeFields.rangeX.boundNodeX.GetAutoGenerationCode(`${varName}.nodeFields.rangeX.BindX(..)`);
        src += "\n";
    } else {
        src += `${varName}.nodeFields.rangeX.SetX(${node.nodeFields.rangeX.GetX()}) \n`;
    }

    if (node.nodeFields.rangeX.boundNodeY !== undefined) {
        src += "\n";
        src += node.nodeFields.rangeX.boundNodeY.GetAutoGenerationCode(`${varName}.nodeFields.rangeX.BindY(..)`);
        src += "\n";
    } else {
        src += `${varName}.nodeFields.rangeX.SetY(${node.nodeFields.rangeX.GetY()}) \n`;
    }

    if (node.nodeFields.rangeY.boundNodeX !== undefined) {
        src += "\n";
        src += node.nodeFields.rangeY.boundNodeX.GetAutoGenerationCode(`${varName}.nodeFields.rangeY.BindX(..)`);
        src += "\n";
    } else {
        src += `${varName}.nodeFields.rangeY.SetX(${node.nodeFields.rangeY.GetX()}) \n`;
    }

    if (node.nodeFields.rangeY.boundNodeY !== undefined) {
        src += "\n";
        src += node.nodeFields.rangeY.boundNodeY.GetAutoGenerationCode(`${varName}.nodeFields.rangeY.BindY(..)`);
        src += "\n";
    } else {
        src += `${varName}.nodeFields.rangeY.SetY(${node.nodeFields.rangeY.GetY()}) \n`;
    }

    if (node.nodeFields.rangeZ.boundNodeX !== undefined) {
        src += "\n";
        src += node.nodeFields.rangeZ.boundNodeX.GetAutoGenerationCode(`${varName}.nodeFields.rangeZ.BindX(..)`);
        src += "\n";
    } else {
        src += `${varName}.nodeFields.rangeZ.SetX(${node.nodeFields.rangeZ.GetX()}) \n`;
    }

    if (node.nodeFields.rangeZ.boundNodeY !== undefined) {
        src += "\n";
        src += node.nodeFields.rangeZ.boundNodeY.GetAutoGenerationCode(`${varName}.nodeFields.rangeZ.BindY(..)`);
        src += "\n";
    } else {
        src += `${varName}.nodeFields.rangeZ.SetY(${node.nodeFields.rangeZ.GetY()}) \n`;
    }

    src += `nodeSystem:AddNode(${varName})`;
    return src;
}
