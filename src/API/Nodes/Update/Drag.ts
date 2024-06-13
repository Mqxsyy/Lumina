import { ConnectableNumberField } from "API/Fields/ConnectableNumberField";
import type { ParticleData } from "API/ParticleService";
import { UpdateNode } from "./UpdateNode";

export class Drag extends UpdateNode {
    static className = "Drag";

    nodeFields = {
        drag: new ConnectableNumberField(0),
    };

    Run(data: ParticleData, dt: number) {
        const drag = this.nodeFields.drag.GetNumber(data) * dt;
        const oldVelocity = data.velocityNormal;

        let [x, y, z] = [0, 0, 0];

        if (oldVelocity.X > 0 && oldVelocity.X - drag > 0) {
            x = oldVelocity.X - drag;
        } else if (oldVelocity.X < 0 && oldVelocity.X + drag < 0) {
            x = oldVelocity.X + drag;
        }

        if (oldVelocity.Y > 0 && oldVelocity.Y - drag > 0) {
            y = oldVelocity.Y - drag;
        } else if (oldVelocity.Y < 0 && oldVelocity.Y + drag < 0) {
            y = oldVelocity.Y + drag;
        }

        if (oldVelocity.Z > 0 && oldVelocity.Z - drag > 0) {
            z = oldVelocity.Z - drag;
        } else if (oldVelocity.Z < 0 && oldVelocity.Z + drag < 0) {
            z = oldVelocity.Z + drag;
        }

        data.velocityNormal = new Vector3(x, y, z);
    }

    GetClassName(): string {
        return Drag.className;
    }
}
