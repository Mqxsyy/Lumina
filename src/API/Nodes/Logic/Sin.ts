import { ConnectableNumberField } from "API/Fields/ConnectableNumberField";
import { NodeGroups } from "API/NodeGroup";
import type { ParticleData } from "API/ParticleService";
import { AutoGenSin } from "../AutoGeneration/LogicNodes/AutoGenSin";
import { LogicNode } from "./LogicNode";

export const SinName = "Sin";
export const SinFieldNames = {
    input: "input",
};

export class Sin extends LogicNode {
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
        return math.sin(this.nodeFields.input.GetNumber(data));
    };

    GetNodeName(): string {
        return SinName;
    }

    GetAutoGenerationCode(wrapper: string) {
        return AutoGenSin(this, wrapper);
    }
}
