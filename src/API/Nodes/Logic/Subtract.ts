import { ConnectableNumberField } from "API/Fields/ConnectableNumberField";
import { NodeGroups } from "API/NodeGroup";
import type { ParticleData } from "API/ParticleService";
import { AutoGenSubtract } from "../AutoGeneration/LogicNodes/AutoGenSubtract";
import { LogicNode } from "./LogicNode";

export const SubtractName = "Subtract";
export const SubtractFieldNames = {
    a: "a",
    b: "b",
};

export class Subtract extends LogicNode {
    nodeGroup: NodeGroups = NodeGroups.Logic;
    nodeFields: {
        a: ConnectableNumberField;
        b: ConnectableNumberField;
    };

    constructor() {
        super();

        this.nodeFields = {
            a: new ConnectableNumberField(2),
            b: new ConnectableNumberField(1),
        };
    }

    Calculate = (data: ParticleData) => {
        const a = this.nodeFields.a.GetNumber(data);
        const b = this.nodeFields.b.GetNumber(data);

        return a - b;
    };

    GetNodeName(): string {
        return SubtractName;
    }

    GetAutoGenerationCode(wrapper: string) {
        return AutoGenSubtract(this, wrapper);
    }
}
