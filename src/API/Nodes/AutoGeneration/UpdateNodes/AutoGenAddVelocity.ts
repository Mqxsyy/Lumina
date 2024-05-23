import type { AddVelocity } from "API/Nodes/Update/AddVelocity";
import type { Src } from "API/VFXScriptCreator";

export function AutoGenAddVelocity(node: AddVelocity, src: Src) {
    const className = `AddVelocity${node.id}`;
    const varName = `addVelocity${node.id}`;

    src.value += `local ${className} = TS.import(script, APIFolder, "Nodes", "Update", "AddVelocity").AddVelocity \n`;
    src.value += `local ${varName} = ${className}.new() \n\n`;

    node.nodeFields.velocity.AutoGenerateField(`${varName}.nodeFields.velocity`, src);

    src.value += "\n";
    src.value += `nodeSystem:AddNode(${varName})`;
}
