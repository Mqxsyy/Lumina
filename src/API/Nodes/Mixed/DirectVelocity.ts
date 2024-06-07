import { ConnectableVector3Field } from "API/Fields/ConnectableVector3Field";
import type { ParticleData } from "API/ParticleService";
import { UpdatePrioriy } from "../Node";
import { MixedNode } from "./MixedNode";

export class DirectVelocity extends MixedNode {
    static className = "DirectVelocity";

    updatePriority = UpdatePrioriy.Last;
    nodeFields = {
        direction: new ConnectableVector3Field(0, 0, 0),
    };

    Run(data: ParticleData) {
        const dir = this.nodeFields.direction.GetSimpleVector3(data);
        if (dir.x === 0 && dir.y === 0 && dir.z === 0) return;

        const targetVector = data.particle.Position.sub(new Vector3(dir.x, dir.y, dir.z));
        const lookDir = CFrame.lookAt(Vector3.zero, targetVector);

        data.velocityNormal = lookDir.mul(data.velocityNormal);
    }

    GetClassName(): string {
        return DirectVelocity.className;
    }
}
