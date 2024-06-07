import { LineGraphField } from "API/Fields/LineGraphField";
import type { ParticleData } from "API/ParticleService";
import { UpdateNode } from "./UpdateNode";

export class SetTransparencyOverLife extends UpdateNode {
    static className = "SetTransparencyOverLife";

    nodeFields = {
        graph: new LineGraphField(),
    };

    Run(data: ParticleData) {
        const lifetime = (os.clock() - data.spawnTime) / data.lifetime;
        data.transparency = this.nodeFields.graph.GetNumber(lifetime);
    }

    GetClassName(): string {
        return SetTransparencyOverLife.className;
    }
}
