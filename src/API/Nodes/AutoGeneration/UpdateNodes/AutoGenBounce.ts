import type { Bounce } from "API/Nodes/Update/Bounce";
import type { Src } from "API/VFXScriptCreator";
import { AutoGenAddToSystem, AutoGenImport } from "../AutoGenLib";

export function AutoGenBounce(node: Bounce, src: Src) {
    const varName = AutoGenImport(node, src);

    node.nodeFields.velocityMultiplier.AutoGenerateField(`${varName}.nodeFields.velocityMultiplier`, src);
    node.nodeFields.limitBounces.AutoGenerateField(`${varName}.nodeFields.limitBounces`, src);
    node.nodeFields.maxBounces.AutoGenerateField(`${varName}.nodeFields.maxBounces`, src);

    AutoGenAddToSystem(varName, src);
}
