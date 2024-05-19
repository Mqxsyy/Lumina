import { ConnectableNumberField } from "API/Fields/ConnectableNumberField";
import { NodeGroups } from "API/NodeGroup";
import type { ParticleData } from "API/ParticleService";
import { AutoGenTan } from "../AutoGeneration/LogicNodes/AutoGenTan";
import { LogicNode } from "./LogicNode";

export const TanName = "Tan";
export const TanFieldNames = {
    input: "input",
};

export class Tan extends LogicNode {
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
        return math.tan(this.nodeFields.input.GetNumber(data));
    };

    GetNodeName(): string {
        return TanName;
    }

    GetAutoGenerationCode(wrapper: string) {
        return AutoGenTan(this, wrapper);
    }
}
