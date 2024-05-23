import { BooleanField } from "API/Fields/BooleanField";
import { ConnectableVector2Field } from "API/Fields/ConnectableVector2Field";
import { Rand } from "API/Lib";
import { NodeGroups } from "API/NodeGroup";
import { AutoGenRandomNumber } from "API/Nodes/AutoGeneration/LogicNodes/AutoGenRandomNumber";
import type { ParticleData } from "API/ParticleService";
import type { Src } from "API/VFXScriptCreator";
import { LogicNode } from "./LogicNode";

export const RandomNumberName = "RandomNumber";
export const RandomNumberFieldNames = {
    range: "range",
    isInt: "isInt",
    randomizeOnce: "randomizeOnce",
};

export class RandomNumber extends LogicNode {
    nodeGroup: NodeGroups = NodeGroups.Logic;
    nodeFields: {
        range: ConnectableVector2Field;
        isInt: BooleanField;
        randomizeOnce: BooleanField;
    };

    constructor() {
        super();

        this.nodeFields = {
            range: new ConnectableVector2Field(0, 0),
            isInt: new BooleanField(false),
            randomizeOnce: new BooleanField(false),
        };
    }

    Calculate = (data: ParticleData) => {
        const range = this.nodeFields.range.GetVector2(data);
        let value = range.x + Rand.NextNumber() * (range.y - range.x);

        if (this.nodeFields.isInt.GetBoolean()) {
            value = math.round(value);
        }

        return value;
    };

    GetNodeName(): string {
        return RandomNumberName;
    }

    GetAutoGenerationCode(src: Src, wrapper: string) {
        AutoGenRandomNumber(this, src, wrapper);
    }
}
