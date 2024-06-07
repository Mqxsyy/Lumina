import { ConnectableNumberField } from "API/Fields/ConnectableNumberField";
import type { ParticleData } from "API/ParticleService";
import { UpdateNode } from "./UpdateNode";

export class Accelerate extends UpdateNode {
    static className = "Accelerate";

    nodeFields = {
        acceleration: new ConnectableNumberField(0),
    };

    Run(data: ParticleData, dt: number) {
        const acceleration = this.nodeFields.acceleration.GetNumber(data) * dt;
        const oldVelocity = data.velocityNormal;

        const x = oldVelocity.X + oldVelocity.X * acceleration;
        const y = oldVelocity.Y + oldVelocity.Y * acceleration;
        const z = oldVelocity.Z + oldVelocity.Z * acceleration;

        data.velocityNormal = new Vector3(x, y, z);
    }

    GetClassName(): string {
        return Accelerate.className;
    }
}
