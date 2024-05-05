import { NumberField } from "API/Fields/NumberField";
import { NodeGroups } from "API/NodeGroup";
import { UpdateParticleData } from "API/ParticleService";
import { UpdateNode } from "./UpdateNode";
import { FrameRateMultiplier } from "API/Lib";
import { AutoGenAccelerate } from "../AutoGeneration/UpdateNodes/AutoGenAccelerate";

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

    Update(id: number) {
        const acceleration = this.nodeFields.acceleration.GetNumber() * FrameRateMultiplier;

        UpdateParticleData(id, (data) => {
            const oldVelocity = data.velocity;

            const x = oldVelocity.X + oldVelocity.X * acceleration;
            const y = oldVelocity.Y + oldVelocity.Y * acceleration;
            const z = oldVelocity.Z + oldVelocity.Z * acceleration;

            data.velocity = new Vector3(x, y, z);
            return data;
        });
    }

    GetNodeName(): string {
        return AccelerateName;
    }

    GetAutoGenerationCode() {
        return AutoGenAccelerate(this);
    }
}
