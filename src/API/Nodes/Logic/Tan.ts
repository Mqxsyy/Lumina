import { ConnectableNumberField } from "API/Fields/ConnectableNumberField";
import { NodeGroups } from "API/NodeGroup";
import type { ParticleData } from "API/ParticleService";
import type { Src } from "API/VFXScriptCreator";
import { AutoGenLogicNode, LogicNode } from "./LogicNode";

export const TanName = "Tan";
export const TanFieldNames = {
    input: "input",
};

export class Tan extends LogicNode {
    nodeGroup: NodeGroups = NodeGroups.Logic;
    nodeFields = {
        input: new ConnectableNumberField(0),
    };

    Calculate = (data: ParticleData) => {
        return math.tan(this.nodeFields.input.GetNumber(data));
    };

    GetNodeName(): string {
        return TanName;
    }

    GetAutoGenerationCode(src: Src, wrapper: string) {
        AutoGenLogicNode(this, src, wrapper, (varName) => {
            this.nodeFields.input.AutoGenerateField(`${varName}.nodeFields.input`, src);
        });
    }
}
