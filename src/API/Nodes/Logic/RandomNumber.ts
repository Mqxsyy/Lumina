import { ConnectableVector2Field } from "API/Fields/ConnectableVector2Field";
import { StateField } from "API/Fields/StateField";
import { Rand } from "API/Lib";
import type { ParticleData } from "API/ParticleService";
import { RangeCount } from "../FieldStates";
import { LogicNode } from "./LogicNode";

export class RandomNumber extends LogicNode {
    static className = "RandomNumber";

    nodeFields = {
        rangeCount: new StateField(RangeCount, RangeCount.SingleRange),
        range1: new ConnectableVector2Field(0, 0),
        range2: new ConnectableVector2Field(0, 0),
    };

    storedValues: Map<number, number> = new Map();

    Calculate = (data: ParticleData) => {
        let value = this.storedValues.get(data.particleId);
        if (value !== undefined) return value;

        const rangeCount = this.nodeFields.rangeCount.GetState();

        if (rangeCount === RangeCount.SingleRange) {
            const range = this.nodeFields.range1.GetSimpleVector2(data);
            value = range.x + Rand.NextNumber() * (range.y - range.x);
        }

        if (rangeCount === RangeCount.DoubleRange) {
            const randomizer = Rand.NextInteger(0, 1);
            if (randomizer === 0) {
                const range = this.nodeFields.range1.GetSimpleVector2(data);

                if (range.x === range.y) {
                    value = range.x;
                } else {
                    value = range.x + Rand.NextNumber() * (range.y - range.x);
                }
            } else {
                const range = this.nodeFields.range2.GetSimpleVector2(data);

                if (range.x === range.y) {
                    value = range.x;
                } else {
                    value = range.x + Rand.NextNumber() * (range.y - range.x);
                }
            }
        }

        this.storedValues.set(data.particleId, value as number);

        data.isRemoving.Connect(() => {
            this.storedValues.delete(data.particleId);
        });

        return value;
    };

    GetClassName(): string {
        return RandomNumber.className;
    }
}
