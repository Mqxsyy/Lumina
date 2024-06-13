import { ConnectableNumberField } from "API/Fields/ConnectableNumberField";
import { ConnectableVector3Field } from "API/Fields/ConnectableVector3Field";
import type { ParticleData } from "API/ParticleService";
import { UpdateNode } from "./UpdateNode";

export class MoveTowards extends UpdateNode {
    static className = "MoveTowards";

    nodeFields = {
        target: new ConnectableVector3Field(0, 0, 0),
        intensity: new ConnectableNumberField(0.1),
        speed: new ConnectableNumberField(1),
    };

    Run(data: ParticleData, dt: number) {
        const target = this.nodeFields.target.GetVector3(data);

        const intensity = this.nodeFields.intensity.GetNumber(data);
        const speed = this.nodeFields.speed.GetNumber(data);
        const targetVector = target.sub(data.particle.Position);

        data.velocityNormal = data.velocityNormal.Lerp(targetVector.div(dt).mul(speed), intensity);
    }

    GetClassName(): string {
        return MoveTowards.className;
    }
}
