import { Vector3Field } from "API/Fields/Vector3Field";
import { UpdateParticleData } from "API/ParticleService";
import { NodeGroups } from "../../NodeGroup";
import { AutoGenSetVelocity } from "../AutoGeneration/InitializeNodes/AutoGenSetVelocity";
import { InitializeNode } from "./InitializeNode";

export const SetVelocityName = "SetVelocity";
export const SetVelocityFieldNames = {
    velocity: "velocity",
};

export class SetVelocity extends InitializeNode {
    nodeGroup: NodeGroups = NodeGroups.Initialize;
    nodeFields: {
        velocity: Vector3Field;
    };

    constructor() {
        super();

        this.nodeFields = {
            velocity: new Vector3Field(0, 0, 0),
        };
    }

    Initialize(id: number) {
        UpdateParticleData(id, (data) => {
            const vector3 = this.nodeFields.velocity.GetVector3();
            data.velocity = new Vector3(vector3.x, vector3.y, vector3.z);
            return data;
        });
    }

    GetNodeName(): string {
        return SetVelocityName;
    }

    GetAutoGenerationCode() {
        return AutoGenSetVelocity(this);
    }
}
