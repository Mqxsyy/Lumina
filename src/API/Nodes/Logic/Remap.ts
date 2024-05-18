import { ConnectableNumberField } from "API/Fields/ConnectableNumberField";
import { ConnectableVector2Field } from "API/Fields/ConnectableVector2Field";
import { RemapValue } from "API/Lib";
import { NodeGroups } from "API/NodeGroup";
import { ParticleData } from "API/ParticleService";
import { AutoGenRemap } from "../AutoGeneration/LogicNodes/AutoGenRemap";
import { LogicNode } from "./LogicNode";

export const RemapName = "Remap";
export const RemapFieldNames = {
    input: "input",
    oldRange: "oldRange",
    newRange: "newRange",
};

export class Remap extends LogicNode {
    nodeGroup: NodeGroups = NodeGroups.Logic;
    nodeFields: {
        input: ConnectableNumberField;
        oldRange: ConnectableVector2Field;
        newRange: ConnectableVector2Field;
    };

    constructor() {
        super();

        this.nodeFields = {
            input: new ConnectableNumberField(0.5),
            oldRange: new ConnectableVector2Field(0, 1),
            newRange: new ConnectableVector2Field(0, 2),
        };
    }

    Calculate = (data: ParticleData) => {
        const input = this.nodeFields.input.GetNumber(data);
        const oldRange = this.nodeFields.oldRange.GetVector2(data);
        const newRange = this.nodeFields.newRange.GetVector2(data);

        return RemapValue(input, oldRange.x, oldRange.y, newRange.x, newRange.y);
    };

    GetNodeName(): string {
        return RemapName;
    }

    GetAutoGenerationCode(wrapper: string) {
        return AutoGenRemap(this, wrapper);
    }
}
