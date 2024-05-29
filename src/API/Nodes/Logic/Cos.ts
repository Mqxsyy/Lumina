import { ConnectableNumberField } from "API/Fields/ConnectableNumberField";
import { NodeGroups } from "API/NodeGroup";
import type { ParticleData } from "API/ParticleService";
import type { Src } from "API/VFXScriptCreator";
import { AutoGenLogicNode, LogicNode } from "./LogicNode";

export const CosName = "Cos";
export const CosFieldNames = {
    input: "input",
};

export class Cos extends LogicNode {
    nodeGroup: NodeGroups = NodeGroups.Logic;
    nodeFields: {
        input: ConnectableNumberField;
    };

    constructor() {
        super();

        this.nodeFields = {
            input: new ConnectableNumberField(0),
        };
    }

    Calculate = (data: ParticleData) => {
        return math.cos(this.nodeFields.input.GetNumber(data));
    };

    GetNodeName(): string {
        return CosName;
    }

    GetAutoGenerationCode(src: Src, wrapper: string) {
        AutoGenLogicNode(this, src, wrapper, (varName) => {
            this.nodeFields.input.AutoGenerateField(`${varName}.nodeFields.input`, src);
        });
    }
}
