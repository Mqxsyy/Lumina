import { ConnectableNumberField } from "API/Fields/ConnectableNumberField";
import { FrameRateMultiplier } from "API/Lib";
import { NodeGroups } from "API/NodeGroup";
import type { ParticleData } from "API/ParticleService";
import type { Src } from "API/VFXScriptCreator";
import { AutoGenAccelerate } from "../AutoGeneration/UpdateNodes/AutoGenAccelerate";
import { UpdateNode } from "./UpdateNode";

export const AccelerateName = "Accelerate";
export const AccelerateFieldNames = {
    acceleration: "acceleration",
};

export class Accelerate extends UpdateNode {
    nodeGroup: NodeGroups = NodeGroups.Update;
    nodeFields: {
        acceleration: ConnectableNumberField;
    };

    constructor() {
        super();

        this.nodeFields = {
            acceleration: new ConnectableNumberField(0),
        };
    }

    Update(data: ParticleData) {
        const acceleration = this.nodeFields.acceleration.GetNumber(data) * FrameRateMultiplier;
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
        AutoGenAccelerate(this, src);
    }
}
