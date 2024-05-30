import { ConnectableNumberField } from "API/Fields/ConnectableNumberField";
import { NodeGroups } from "API/NodeGroup";
import type { ParticleData } from "API/ParticleService";
import type { Src } from "API/VFXScriptCreator";
import { AutoGenLogicNode, LogicNode } from "./LogicNode";

export const SinName = "Sin";
export const SinFieldNames = {
    input: "input",
};

export class Sin extends LogicNode {
    nodeGroup: NodeGroups = NodeGroups.Logic;
    nodeFields = {
        input: new ConnectableNumberField(0),
    };

    Calculate = (data: ParticleData) => {
        return math.sin(this.nodeFields.input.GetNumber(data));
    };

    GetNodeName(): string {
        return SinName;
    }

    GetAutoGenerationCode(src: Src, wrapper: string) {
        AutoGenLogicNode(this, src, wrapper, (varName) => {
            this.nodeFields.input.AutoGenerateField(`${varName}.nodeFields.input`, src);
        });
    }
}
