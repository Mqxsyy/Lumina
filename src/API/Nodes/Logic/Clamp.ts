import { ConnectableNumberField } from "API/Fields/ConnectableNumberField";
import { ConnectableVector2Field } from "API/Fields/ConnectableVector2Field";
import type { ParticleData } from "API/ParticleService";
import { LogicNode } from "./LogicNode";

export class Clamp extends LogicNode {
    static className = "Clamp";

    nodeFields = {
        input: new ConnectableNumberField(0),
        range: new ConnectableVector2Field(0, 1),
    };

    Calculate = (data: ParticleData) => {
        const input = this.nodeFields.input.GetNumber(data);
        const range = this.nodeFields.range.GetSimpleVector2(data);

        return math.clamp(input, range.x, range.y);
    };

    GetClassName(): string {
        return Clamp.className;
    }
}
