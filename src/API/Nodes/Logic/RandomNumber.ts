import { ConnectableVector2Field } from "API/Fields/ConnectableVector2Field";
import { Rand } from "API/Lib";
import type { ParticleData } from "API/ParticleService";
import { LogicNode } from "./LogicNode";

export class RandomNumber extends LogicNode {
    static className = "RandomNumber";

    nodeFields = {
        range: new ConnectableVector2Field(0, 0),
    };

    storedValues: Map<number, number> = new Map();

    Calculate = (data: ParticleData) => {
        let value = this.storedValues.get(data.particleId);
        if (value !== undefined) return value;

        const range = this.nodeFields.range.GetSimpleVector2(data);
        value = range.x + Rand.NextNumber() * (range.y - range.x);

        this.storedValues.set(data.particleId, value);

        data.isRemoving.Connect(() => {
            this.storedValues.delete(data.particleId);
        });

        return value;
    };

    GetClassName(): string {
        return RandomNumber.className;
    }
}
