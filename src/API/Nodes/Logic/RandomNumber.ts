import { BooleanField } from "API/Fields/BooleanField";
import { ConnectableVector2Field } from "API/Fields/ConnectableVector2Field";
import { Rand } from "API/Lib";
import type { ParticleData } from "API/ParticleService";
import { LogicNode } from "./LogicNode";

export class RandomNumber extends LogicNode {
    static className = "RandomNumber";

    nodeFields = {
        range: new ConnectableVector2Field(0, 0),
        isInt: new BooleanField(false),
        randomizeOnce: new BooleanField(false),
    };

    Calculate = (data: ParticleData) => {
        const range = this.nodeFields.range.GetSimpleVector2(data);
        let value = range.x + Rand.NextNumber() * (range.y - range.x);

        if (this.nodeFields.isInt.GetBoolean()) {
            value = math.round(value);
        }

        return value;
    };

    GetClassName(): string {
        return RandomNumber.className;
    }
}
