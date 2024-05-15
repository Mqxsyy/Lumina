import { Vector3Field } from "API/Fields/Vector3Field";
import { FrameRateMultiplier } from "API/Lib";
import { NodeGroups } from "API/NodeGroup";
import { ParticleData } from "API/ParticleService";
import { AutoGenAddVelocity } from "../AutoGeneration/UpdateNodes/AutoGenAddVelocity";
import { UpdateNode } from "./UpdateNode";

export const AddVelocityName = "AddVelocity";
export const AddVelocityFieldNames = {
    velocity: "velocity",
};

export class AddVelocity extends UpdateNode {
    nodeGroup: NodeGroups = NodeGroups.Update;
    nodeFields: {
        velocity: Vector3Field;
    };

    constructor() {
        super();

        this.nodeFields = {
            velocity: new Vector3Field(0, 0, 0),
        };
    }

    Update(data: ParticleData) {
        const acceleration = this.nodeFields.velocity.GetVector3();
        const oldVelocity = data.velocityNormal;

        const x = oldVelocity.X + acceleration.x * FrameRateMultiplier;
        const y = oldVelocity.Y + acceleration.y * FrameRateMultiplier;
        const z = oldVelocity.Z + acceleration.z * FrameRateMultiplier;

        data.velocityNormal = new Vector3(x, y, z);
    }

    GetNodeName(): string {
        return AddVelocityName;
    }

    GetAutoGenerationCode() {
        return AutoGenAddVelocity(this);
    }
}
