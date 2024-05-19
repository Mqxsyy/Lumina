import { ConnectableNumberField } from "API/Fields/ConnectableNumberField";
import { NodeGroups } from "API/NodeGroup";
import type { ParticleData } from "API/ParticleService";
import { AutoGenNumberInput } from "../AutoGeneration/LogicNodes/AutoGenNumber";
import { LogicNode } from "./LogicNode";

export const NumberInputName = "NumberInput";
export const NumberInputFieldNames = {
    input: "input",
};

export class NumberInput extends LogicNode {
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
        return NumberInputName;
    }

    GetAutoGenerationCode(wrapper: string) {
        return AutoGenNumberInput(this, wrapper);
    }
}
