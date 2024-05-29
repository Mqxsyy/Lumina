import { ConnectableVector3Field } from "API/Fields/ConnectableVector3Field";
import { FrameRateMultiplier } from "API/Lib";
import { NodeGroups } from "API/NodeGroup";
import type { ParticleData } from "API/ParticleService";
import type { Src } from "API/VFXScriptCreator";
import { AutoGenAddVelocity } from "../AutoGeneration/UpdateNodes/AutoGenAddVelocity";
import { UpdateNode } from "./UpdateNode";

export const AddVelocityName = "AddVelocity";
export const AddVelocityFieldNames = {
    velocity: "velocity",
};

export class AddVelocity extends UpdateNode {
    nodeGroup: NodeGroups = NodeGroups.Update;
    nodeFields: {
        velocity: ConnectableVector3Field;
    };

    constructor() {
        super();

        this.nodeFields = {
            velocity: new ConnectableVector3Field(0, 0, 0),
        };
    }

    Update(data: ParticleData, dt: number) {
        const acceleration = this.nodeFields.velocity.GetVector3(data);
        const oldVelocity = data.velocityNormal;

        const x = oldVelocity.X + acceleration.x * dt;
        const y = oldVelocity.Y + acceleration.y * dt;
        const z = oldVelocity.Z + acceleration.z * dt;

        data.velocityNormal = new Vector3(x, y, z);
    }

    GetNodeName(): string {
        return AddVelocityName;
    }

    GetAutoGenerationCode(src: Src) {
        AutoGenAddVelocity(this, src);
    }
}
