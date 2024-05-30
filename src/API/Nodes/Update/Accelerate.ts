import { ConnectableNumberField } from "API/Fields/ConnectableNumberField";
import { NodeGroups } from "API/NodeGroup";
import type { ParticleData } from "API/ParticleService";
import type { Src } from "API/VFXScriptCreator";
import { AutoGenUpdateNode, UpdateNode } from "./UpdateNode";

export const AccelerateName = "Accelerate";
export const AccelerateFieldNames = {
    acceleration: "acceleration",
};

export class Accelerate extends UpdateNode {
    nodeGroup: NodeGroups = NodeGroups.Update;
    nodeFields = {
        acceleration: new ConnectableNumberField(0),
    };

    Update(data: ParticleData, dt: number) {
        const acceleration = this.nodeFields.acceleration.GetNumber(data) * dt;
        const oldVelocity = data.velocityNormal;

        const x = oldVelocity.X + oldVelocity.X * acceleration;
        const y = oldVelocity.Y + oldVelocity.Y * acceleration;
        const z = oldVelocity.Z + oldVelocity.Z * acceleration;

        data.velocityNormal = new Vector3(x, y, z);
    }

    GetNodeName(): string {
        return AccelerateName;
    }

    GetAutoGenerationCode(src: Src) {
        AutoGenUpdateNode(this, src, (varName) => {
            this.nodeFields.acceleration.AutoGenerateField(`${varName}.nodeFields.acceleration`, src);
        });
    }
}
