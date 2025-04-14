import { LineGraphField } from "API/Fields/LineGraphField";
import type { ParticleData } from "API/ParticleService";
import { UpdateNode } from "./UpdateNode";

export class SetSizeOverLife extends UpdateNode {
    static className = "SetSizeOverLife";

    nodeFields = {
        graph: new LineGraphField(),
    };

    Run(data: ParticleData) {
        const lifetime = (os.clock() - data.spawnTime) / data.lifetime;
        const size = this.nodeFields.graph.GetNumber(lifetime);
        const sizeVector3 = new Vector3(size, size, size);

        if (data.sizeNormal === sizeVector3) return data;
        data.sizeNormal = sizeVector3;
    }

    GetClassName(): string {
        return SetSizeOverLife.className;
    }
}
