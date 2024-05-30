import { ConnectableNumberField } from "API/Fields/ConnectableNumberField";
import { NodeGroups } from "API/NodeGroup";
import type { ParticleData } from "API/ParticleService";
import type { Src } from "API/VFXScriptCreator";
import { AutoGenLogicNode, LogicNode } from "./LogicNode";

export const DivideName = "Divide";
export const DivideFieldNames = {
    a: "a",
    b: "b",
};

export class Divide extends LogicNode {
    nodeGroup: NodeGroups = NodeGroups.Logic;
    nodeFields = {
        a: new ConnectableNumberField(1),
        b: new ConnectableNumberField(1),
    };

    Calculate = (data: ParticleData) => {
        const a = this.nodeFields.a.GetNumber(data);
        const b = this.nodeFields.b.GetNumber(data);

        if (b === 0) {
            warn("Can not divide by zero");
            return b;
        }

        return a / b;
    };

    GetNodeName(): string {
        return DivideName;
    }

    GetAutoGenerationCode(src: Src, wrapper: string) {
        AutoGenLogicNode(this, src, wrapper, (varName) => {
            this.nodeFields.a.AutoGenerateField(`${varName}.nodeFields.a`, src);
            this.nodeFields.b.AutoGenerateField(`${varName}.nodeFields.b`, src);
        });
    }
}
