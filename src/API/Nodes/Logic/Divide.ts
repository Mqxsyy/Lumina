import { ConnectableNumberField } from "API/Fields/ConnectableNumberField";
import { NodeGroups } from "API/NodeGroup";
import type { ParticleData } from "API/ParticleService";
import type { Src } from "API/VFXScriptCreator";
import { AutoGenDivide } from "../AutoGeneration/LogicNodes/AutoGenDivide";
import { LogicNode } from "./LogicNode";

export const DivideName = "Divide";
export const DivideFieldNames = {
    a: "a",
    b: "b",
};

export class Divide extends LogicNode {
    nodeGroup: NodeGroups = NodeGroups.Logic;
    nodeFields: {
        a: ConnectableNumberField;
        b: ConnectableNumberField;
    };

    constructor() {
        super();

        this.nodeFields = {
            a: new ConnectableNumberField(1),
            b: new ConnectableNumberField(1),
        };
    }

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
        AutoGenDivide(this, src, wrapper);
    }
}
