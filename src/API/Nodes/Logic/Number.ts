import { ConnectableNumberField } from "API/Fields/ConnectableNumberField";
import { NodeGroups } from "API/NodeGroup";
import { ParticleData } from "API/ParticleService";
import { AutoGenNumber } from "../AutoGeneration/LogicNodes/AutoGenNumber";
import { LogicNode } from "./LogicNode";

export const NumberName = "Number";
export const NumberFieldNames = {
    input: "input",
};

export class Number extends LogicNode {
    nodeGroup: NodeGroups = NodeGroups.Logic;
    nodeFields: {
        input: ConnectableNumberField;
    };

    constructor() {
        super();

        this.nodeFields = {
            input: new ConnectableNumberField(1),
        };
    }

    Calculate = (data: ParticleData) => {
        return this.nodeFields.input.GetNumber(data);
    };

    GetNodeName(): string {
        return NumberName;
    }

    GetAutoGenerationCode(wrapper: string) {
        return AutoGenNumber(this, wrapper);
    }
}
