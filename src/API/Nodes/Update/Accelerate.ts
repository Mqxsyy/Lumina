import { NumberField } from "API/Fields/NumberField";
import { FrameRateMultiplier } from "API/Lib";
import { NodeGroups } from "API/NodeGroup";
import { ParticleData } from "API/ParticleService";
import { AutoGenAccelerate } from "../AutoGeneration/UpdateNodes/AutoGenAccelerate";
import { UpdateNode } from "./UpdateNode";

export const AccelerateName = "Accelerate";
export const AccelerateFieldNames = {
    acceleration: "acceleration",
};

export class Accelerate extends UpdateNode {
    nodeGroup: NodeGroups = NodeGroups.Update;
    nodeFields: {
        acceleration: NumberField;
    };

    constructor() {
        super();

        this.nodeFields = {
            acceleration: new NumberField(0),
        };
    }

    Update(data: ParticleData) {
        const acceleration = this.nodeFields.acceleration.GetNumber() * FrameRateMultiplier;
        const oldVelocity = data.velocityNormal;

        const x = oldVelocity.X + oldVelocity.X * acceleration;
        const y = oldVelocity.Y + oldVelocity.Y * acceleration;
        const z = oldVelocity.Z + oldVelocity.Z * acceleration;

        data.velocityNormal = new Vector3(x, y, z);
    }

    GetNodeName(): string {
        return AccelerateName;
    }

    GetAutoGenerationCode() {
        return AutoGenAccelerate(this);
    }
}
