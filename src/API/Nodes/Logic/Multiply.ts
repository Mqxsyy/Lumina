import { ConnectableNumberField } from "API/Fields/ConnectableNumberField";
import { NodeGroups } from "API/NodeGroup";
import type { ParticleData } from "API/ParticleService";
import { AutoGenMultiply } from "../AutoGeneration/LogicNodes/AutoGenMultiply";
import { LogicNode } from "./LogicNode";

export const MultiplyName = "Multiply";
export const MultiplyFieldNames = {
    a: "a",
    b: "b",
};

export class Multiply extends LogicNode {
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

        return a * b;
    };

    GetNodeName(): string {
        return MultiplyName;
    }

    GetAutoGenerationCode(wrapper: string) {
        return AutoGenMultiply(this, wrapper);
    }
}
