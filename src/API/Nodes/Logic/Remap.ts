import { ConnectableNumberField } from "API/Fields/ConnectableNumberField";
import { ConnectableVector2Field } from "API/Fields/ConnectableVector2Field";
import { RemapValue } from "API/Lib";
import type { ParticleData } from "API/ParticleService";
import { LogicNode } from "./LogicNode";

export class Remap extends LogicNode {
    static className = "Remap";

    nodeFields = {
        input: new ConnectableNumberField(0.5),
        oldRange: new ConnectableVector2Field(0, 1),
        newRange: new ConnectableVector2Field(0, 2),
    };

    Calculate = (data: ParticleData) => {
        const input = this.nodeFields.input.GetNumber(data);
        const oldRange = this.nodeFields.oldRange.GetSimpleVector2(data);
        const newRange = this.nodeFields.newRange.GetSimpleVector2(data);

        return RemapValue(input, oldRange.x, oldRange.y, newRange.x, newRange.y);
    };

    GetClassName(): string {
        return Remap.className;
    }
}
