import { LineGraphField } from "API/Fields/LineGraphField";
import type { ParticleData } from "API/ParticleService";
import { UpdateNode } from "./UpdateNode";

export class MultiplyVelocityOverLife extends UpdateNode {
    static className = "MultiplyVelocityOverLife";

    nodeFields = {
        graph: new LineGraphField(),
    };

    Run(data: ParticleData) {
        const lifetime = (os.clock() - data.spawnTime) / data.lifetime;
        const muliplier = this.nodeFields.graph.GetNumber(lifetime);
        data.velocityMultiplier = new Vector3(muliplier, muliplier, muliplier);
    }

    GetClassName(): string {
        return MultiplyVelocityOverLife.className;
    }
}
