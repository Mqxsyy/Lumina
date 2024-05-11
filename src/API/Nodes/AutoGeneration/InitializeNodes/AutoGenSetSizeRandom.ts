import { SetSizeRandom } from "API/Nodes/Initialize/SetSizeRandom";

export function AutoGenSetSizeRandom(node: SetSizeRandom) {
    const className = `SetSizeRandom${node.id}`;
    const varName = `setSizeRandom${node.id}`;

    let src = `local ${className} = TS.import(script, APIFolder, "Nodes", "Initialize", "SetSizeRandom").SetSizeRandom \n`;
    src += `local ${varName} = ${className}.new() \n`;

    if (node.nodeFields.range.boundNodeX !== undefined) {
        src += "\n";
        src += node.nodeFields.range.boundNodeX.GetAutoGenerationCode(`${varName}.nodeFields.range.BindX(..)`);
        src += "\n";
    } else {
        src += `${varName}.nodeFields.range.SetX(${node.nodeFields.range.GetX()}) \n`;
    }

    if (node.nodeFields.range.boundNodeY !== undefined) {
        src += "\n";
        src += node.nodeFields.range.boundNodeY.GetAutoGenerationCode(`${varName}.nodeFields.range.BindY(..)`);
        src += "\n";
    } else {
        src += `${varName}.nodeFields.range.SetY(${node.nodeFields.range.GetY()}) \n`;
    }

    src += `nodeSystem:AddNode(${varName})`;
    return src;
}
