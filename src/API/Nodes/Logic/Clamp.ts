import { ConnectableNumberField } from "API/Fields/ConnectableNumberField";
import { ConnectableVector2Field } from "API/Fields/ConnectableVector2Field";
import { NodeGroups } from "API/NodeGroup";
import { ParticleData } from "API/ParticleService";
import { AutoGenClamp } from "../AutoGeneration/LogicNodes/AutoGenClamp";
import { LogicNode } from "./LogicNode";

export const ClampName = "Clamp";
export const ClampFieldNames = {
    input: "input",
    range: "range",
};

export class Clamp extends LogicNode {
    nodeGroup: NodeGroups = NodeGroups.Logic;
    nodeFields: {
        input: ConnectableNumberField;
        range: ConnectableVector2Field;
    };

    constructor() {
        super();

        this.nodeFields = {
            input: new ConnectableNumberField(0),
            range: new ConnectableVector2Field(0, 1),
        };
    }

    Calculate = (data: ParticleData) => {
        const input = this.nodeFields.input.GetNumber(data);
        const range = this.nodeFields.range.GetVector2(data);

        return math.clamp(input, range.x, range.y);
    };

    GetNodeName(): string {
        return ClampName;
    }

    GetAutoGenerationCode(wrapper: string) {
        return AutoGenClamp(this, wrapper);
    }
}
