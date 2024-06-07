import type { ParticleData } from "API/ParticleService";
import { ConnectableNumberField } from "../../Fields/ConnectableNumberField";
import { MixedNode } from "./MixedNode";

export class SetEmission extends MixedNode {
    static className = "SetEmission";

    nodeFields = {
        emission: new ConnectableNumberField(1),
    };

    Run(data: ParticleData) {
        data.emission = this.nodeFields.emission.GetNumber(data);
    }

    GetClassName(): string {
        return SetEmission.className;
    }
}
