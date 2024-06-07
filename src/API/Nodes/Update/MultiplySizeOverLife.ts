import { LineGraphField } from "API/Fields/LineGraphField";
import type { ParticleData } from "API/ParticleService";
import { UpdateNode } from "./UpdateNode";

export class MultiplySizeOverLife extends UpdateNode {
    static className = "MultiplySizeOverLife";

    nodeFields = {
        graph: new LineGraphField(),
    };

    Run(data: ParticleData) {
        const lifetime = (os.clock() - data.spawnTime) / data.lifetime;
        const muliplier = this.nodeFields.graph.GetNumber(lifetime) - 1;

        const x = data.sizeNormal.X * muliplier;
        const y = data.sizeNormal.Y * muliplier;
        const z = data.sizeNormal.Z * muliplier;

        data.sizeMultiplier = new Vector3(x, y, z);
    }

    GetClassName(): string {
        return MultiplySizeOverLife.className;
    }
}
