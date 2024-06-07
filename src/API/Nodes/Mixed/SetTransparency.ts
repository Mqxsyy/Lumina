import type { ParticleData } from "API/ParticleService";
import { ConnectableNumberField } from "../../Fields/ConnectableNumberField";
import { MixedNode } from "./MixedNode";

export class SetTransparency extends MixedNode {
    static className = "SetTransparency";

    nodeFields = {
        transparency: new ConnectableNumberField(0),
    };

    Run(data: ParticleData) {
        data.transparency = this.nodeFields.transparency.GetNumber(data);
    }

    GetClassName(): string {
        return SetTransparency.className;
    }
}
