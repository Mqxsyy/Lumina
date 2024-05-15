import { AddRotationZRandom } from "API/Nodes/Update/AddRotationZRandom";

export function AutoGenAddRotationZRandom(node: AddRotationZRandom) {
    const className = `AddRotationZRandom${node.id}`;
    const varName = `addRotationZRandom${node.id}`;

    let src = `local ${className} = TS.import(script, APIFolder, "Nodes", "Update", "AddRotationZRandom").AddRotationZRandom \n`;
    src += `local ${varName} = ${className}.new() \n`;

    src += node.nodeFields.range.AutoGenerateField(`${varName}.nodeFields.range`);

    src += `nodeSystem:AddNode(${varName})`;
    return src;
}
