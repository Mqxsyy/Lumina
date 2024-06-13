import { ColorRampField } from "API/Fields/ColorRampField";
import type { ParticleData } from "API/ParticleService";
import { UpdateNode } from "./UpdateNode";

export class SetColorOverLife extends UpdateNode {
    static className = "SetColorOverLife";

    nodeFields = {
        ramp: new ColorRampField(),
    };

    Run(data: ParticleData) {
        const lifetime = (os.clock() - data.spawnTime) / data.lifetime;
        data.color = this.nodeFields.ramp.GetColor(lifetime);
    }

    GetClassName(): string {
        return SetColorOverLife.className;
    }
}
