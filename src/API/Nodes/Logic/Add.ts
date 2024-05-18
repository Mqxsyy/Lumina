import { ConnectableNumberField } from "API/Fields/ConnectableNumberField";
import { NodeGroups } from "API/NodeGroup";
import { LogicNode } from "./LogicNode";
import { AutoGenAdd } from "../AutoGeneration/LogicNodes/AutoGenAdd";
import { ParticleData } from "API/ParticleService";

export const AddName = "Add";
export const AddFieldNames = {
    a: "a",
    b: "b",
};

export class Add extends LogicNode {
    nodeGroup: NodeGroups = NodeGroups.Logic;
    nodeFields: {
        a: ConnectableNumberField;
        b: ConnectableNumberField;
    };

    constructor() {
        super();

        this.nodeFields = {
            a: new ConnectableNumberField(1),
            b: new ConnectableNumberField(0),
        };
    }

    Calculate = (data: ParticleData) => {
        const a = this.nodeFields.a.GetNumber(data);
        const b = this.nodeFields.b.GetNumber(data);

        return a + b;
    };

    GetNodeName(): string {
        return AddName;
    }

    GetAutoGenerationCode(wrapper: string) {
        return AutoGenAdd(this, wrapper);
    }
}
