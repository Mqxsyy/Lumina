import type { MultiplyVelocityOverLife } from "API/Nodes/Update/MultiplyVelocityOverLife";
import type { Src } from "API/VFXScriptCreator";

export function AutoGenMultiplyVelocityOverLife(node: MultiplyVelocityOverLife, src: Src) {
    const className = `MultiplyVelocityOverLife${node.id}`;
    const varName = `multiplyVelocityOverLife${node.id}`;

    src.value += `local ${className} = TS.import(script, APIFolder, "Nodes", "Update", "MultiplyVelocityOverLife").MultiplyVelocityOverLife \n`;
    src.value += `local ${varName} = ${className}.new() \n\n`;

    node.nodeFields.graph.AutoGenerateField(`${varName}.nodeFields.graph`, src);

    src.value += "\n";
    src.value += `nodeSystem:AddNode(${varName})`;
}
